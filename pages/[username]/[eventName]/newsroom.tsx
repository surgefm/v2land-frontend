// #region Global Imports
import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useSelector, useStore, useDispatch } from 'react-redux';
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { extractClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import { Switch, Tooltip, Space, Popover, message } from 'antd';
import { EyeOutlined, EyeInvisibleOutlined, QuestionCircleOutlined } from '@ant-design/icons';
// #endregion Global Imports

// #region Local Imports
import { useTranslation } from '@I18n';
import { NewsroomActions, ChatroomActions } from '@Actions';
import {
  getNewsroomSocket,
  closeNewsroomSocket,
  NewsroomSocket,
  handleNewsDrop,
  handleStackDrop,
  ClientService,
  UtilService,
  RedstoneService,
  usePrevious,
  isNewsDragData,
  isStackDragData,
  isNewsListDropData,
  isStackItemDropData,
  isStackListDropData,
  getDestinationIndex,
} from '@Services';
import { NewsroomPanelConsts } from '@Definitions';
import { Card, EventHead } from '@Components';
import {
  NewsroomPanelAddClientButton,
  NewsroomPanelTitle,
  NewsroomPanelNewsList,
  NewsroomPanelNewsSearchBox,
  NewsroomPanelStackList,
  NewsroomPanelEventDetail,
  NewsroomPanelCreateStackButton,
  NewsroomPanelRoleList,
  NewsroomPanelSortStacksButton,
} from '@Components/Newsroom/Panel';
import { ChatroomButtonProps } from '@Components/Chatroom/Button/Button';
import {
  getEvent,
  getEventStackIdList,
  getEventOffshelfNewsIdList,
  getEventOffshelfStackIdList,
  getEventNewsIdList,
  getNewsroomPanels,
  getEventOwner,
  isStackNewsVisible,
  canCurrentClientViewEvent,
  getNewsroomCurrentClientRole,
  isLoggedIn,
} from '@Selectors';
// #endregion Local Imports

// #region Interface Imports
import { IEventNewsroomPage, ReduxNextPageContext } from '@Interfaces';
// #endregion Interface Imports

const ChatroomButton = dynamic(() => import('@Components/Chatroom')) as React.FC<
  ChatroomButtonProps
>;

const EventNewsroomPage: NextPage<IEventNewsroomPage.IProps, IEventNewsroomPage.InitialProps> = ({
  eventId: id,
}) => {
  const { t } = useTranslation('common');
  const eventId = -Math.abs(id);
  const event = useSelector(getEvent(eventId));
  const prevEvent = usePrevious(event);
  const owner = useSelector(getEventOwner(eventId));
  const newsIdList = useSelector(getEventNewsIdList(eventId));
  const offshelfNewsIdList = useSelector(getEventOffshelfNewsIdList(eventId));
  const offshelfStackIdList = useSelector(getEventOffshelfStackIdList(eventId));
  const stackIdList = useSelector(getEventStackIdList(eventId));
  const newsroomPanels = useSelector(getNewsroomPanels);
  const showStackNews = useSelector(isStackNewsVisible);
  const canView = useSelector(canCurrentClientViewEvent(eventId));
  const prevCanView = usePrevious(canView);
  const loggedIn = useSelector(isLoggedIn);
  const role = useSelector(getNewsroomCurrentClientRole(eventId));
  const prevRole = usePrevious(role);
  const store = useStore();
  const dispatch = useDispatch();
  const router = useRouter();
  const [showChatroom, setShowChatroom] = useState(!!(router.query.apply || router.query.c));
  let socket = getNewsroomSocket(eventId, store) as NewsroomSocket;

  const getEventPath = () =>
    event
      ? `/@${owner ? owner.username : event.ownerId}/${Math.abs(event.id)}-${event.pinyin}`
      : '/';

  useEffect(() => {
    dispatch(NewsroomActions.SetActiveNewsroom(eventId));
    return () => {
      NewsroomActions.SetActiveNewsroom(0);
      closeNewsroomSocket(eventId);
    };
  }, []);

  useEffect(() => {
    setShowChatroom(true);
  });

  useEffect(() => {
    if (loggedIn && prevRole && role && role !== prevRole) {
      message.info(`你已被设为该事件的「${ClientService.getRoleName(role)}」`);
    }
  }, [role]);

  useEffect(() => {
    if (!canView && canView !== prevCanView) {
      if (loggedIn) {
        message.error('你没有查看该新闻编辑室的权限');
      }
      UtilService.redirect(getEventPath());
    }
  }, [canView]);

  useEffect(() => {
    if (prevEvent && event && event.name !== prevEvent.name) {
      UtilService.replace(`${getEventPath()}/newsroom`);
    }
  }, [event]);

  useEffect(() => {
    socket = getNewsroomSocket(eventId, store) as NewsroomSocket;
  });

  // Monitor for all drag-and-drop events
  useEffect(() => {
    return monitorForElements({
      onDrop: ({ source, location }) => {
        const destination = location.current.dropTargets[0];
        if (!destination) return;

        const sourceData = source.data;
        const destData = destination.data;

        if (isNewsDragData(sourceData) && isNewsListDropData(destData)) {
          handleNewsDrop(sourceData, destData, eventId, store, socket);
        } else if (isStackDragData(sourceData)) {
          // Find the innermost drop target that is a stack-item (for edge detection)
          const stackItemTarget = location.current.dropTargets.find(target =>
            isStackItemDropData(target.data)
          );

          // Find the stack-list drop target for the destination droppableId
          const stackListTarget = location.current.dropTargets.find(target =>
            isStackListDropData(target.data)
          );

          if (!stackListTarget || !isStackListDropData(stackListTarget.data)) return;
          const destDroppableId = stackListTarget.data.droppableId;

          let destIndex: number;
          if (stackItemTarget && isStackItemDropData(stackItemTarget.data)) {
            const edge = extractClosestEdge(stackItemTarget.data);
            destIndex = edge
              ? getDestinationIndex(stackItemTarget.data.index, edge, sourceData.index)
              : stackItemTarget.data.index;
          } else {
            // Dropped on empty list or directly on the list container
            destIndex = 0;
          }

          handleStackDrop(sourceData, destDroppableId, destIndex, eventId, store, socket);
        }
      },
    });
  }, [eventId, store, socket]);

  if (!event) return <div />;

  const onStackNewsVisibilityToggled = (checked: boolean) => {
    dispatch(NewsroomActions.SetStackNewsVisible(checked));
  };

  const panels: { [index: string]: React.ReactNode } = {
    [NewsroomPanelConsts.EventInformation]: (
      <div className="panel-wrapper" key={NewsroomPanelConsts.EventInformation}>
        <Card className="panel y-scroll">
          <div className="panel-header-container">
            <NewsroomPanelTitle>事件信息</NewsroomPanelTitle>
          </div>
          <NewsroomPanelEventDetail eventId={eventId} />
        </Card>
      </div>
    ),
    [NewsroomPanelConsts.EventRoleList]: (
      <div className="panel-wrapper" key={NewsroomPanelConsts.EventRoleList}>
        <Card className="panel y-scroll">
          <div className="panel-header-container">
            <Space size={0}>
              <NewsroomPanelTitle>{t('Newsroom_ContributorList')}</NewsroomPanelTitle>
              <Popover
                overlayClassName="tooltip-fit-content"
                content={
                  // eslint-disable-next-line react/jsx-wrap-multilines
                  <>
                    <p>
                      <b>{t('Newsroom_Role_Observer')}</b>：{t('Newsroom_Role_ObserverPermission')}
                    </p>
                    <p>
                      <b>{t('Newsroom_Role_Editor')}</b>：{t('Newsroom_Role_EditorPermission')}
                    </p>
                    <p>
                      <b>{t('Newsroom_Role_Manager')}</b>：{t('Newsroom_Role_ManagerPermission')}
                    </p>
                    <span>
                      <b>{t('Newsroom_Role_Owner')}</b>：{t('Newsroom_Role_OwnerPermission')}
                    </span>
                  </>
                }
              >
                <QuestionCircleOutlined />
              </Popover>
            </Space>
            <NewsroomPanelAddClientButton eventId={eventId} />
          </div>
          <NewsroomPanelRoleList eventId={eventId} />
        </Card>
      </div>
    ),
    [NewsroomPanelConsts.OffshelfNewsList]: (
      <div className="panel-wrapper" key={NewsroomPanelConsts.OffshelfNewsList}>
        <Card className="panel">
          <div className="panel-header-container">
            <NewsroomPanelTitle>{t('Newsroom_OffshelfNews')}</NewsroomPanelTitle>
          </div>
          <NewsroomPanelNewsSearchBox eventId={eventId} newsIdList={newsIdList} />
          <NewsroomPanelNewsList
            newsIdList={offshelfNewsIdList}
            droppableId="newsroom-news-list"
            removable
          />
        </Card>
      </div>
    ),
    [NewsroomPanelConsts.OffshelfStackList]: (
      <div className="panel-wrapper" key={NewsroomPanelConsts.OffshelfStackList}>
        <Card className="panel offshelf-stack">
          <div className="panel-header-container">
            <NewsroomPanelTitle>{t('Newsroom_OffshelfStacks')}</NewsroomPanelTitle>
            <Space size={0}>
              <NewsroomPanelSortStacksButton eventId={eventId} offshelf />
              <NewsroomPanelCreateStackButton eventId={eventId} />
            </Space>
          </div>
          <NewsroomPanelStackList
            droppableId="newsroom-offshelf-stack-panel"
            stackIdList={offshelfStackIdList}
          />
        </Card>
      </div>
    ),
  };

  return (
    <>
      <div className="container">
        <EventHead eventId={eventId} title={t('Newsroom_Title')} />
        {showChatroom && (
          <ChatroomButton
            type="newsroom"
            ids={Math.abs(event.id)}
            openByDefault={!!(router.query.apply || router.query.c)}
            presetMessage={router.query.apply ? '你好，我想帮忙整理这条时间线！' : undefined}
          />
        )}
        <div className="panel-wrapper">
          <Card className="panel public-stack">
            <div className="panel-header-container">
              <NewsroomPanelTitle>{t('Newsroom_Timeline')}</NewsroomPanelTitle>
              <Space size={0}>
                <NewsroomPanelSortStacksButton eventId={eventId} />
                <Tooltip
                  title={showStackNews ? t('Newsroom_HideStackNews') : t('Newsroom_ShowStackNews')}
                >
                  <Switch
                    checkedChildren={<EyeOutlined />}
                    unCheckedChildren={<EyeInvisibleOutlined />}
                    className="show-news-toggle"
                    onClick={onStackNewsVisibilityToggled}
                    defaultChecked={showStackNews}
                  />
                </Tooltip>
              </Space>
            </div>
            <NewsroomPanelStackList stackIdList={stackIdList} />
          </Card>
        </div>
        {newsroomPanels.map(panel => panels[panel])}
      </div>

      <style jsx>
        {`
          :global(html),
          :global(body) {
            position: relative;
          }

          .container {
            min-width: 100%;
            height: calc(100vh - 15px);
            padding: 5rem 1rem 1rem 1rem;
            overflow-y: hidden;
            overflow-x: hidden;
            display: inline-flex;
          }

          .container > :global(.panel-wrapper) {
            min-width: 20rem;
            height: 100%;
            margin: 0 0.5rem;
          }

          .container > :global(.panel-wrapper) > :global(.panel) {
            max-height: 100%;
            padding: 0;
            width: 25rem;
            display: flex;
            flex-direction: column;
            overflow: hidden;
          }

          .container :global(*)::-webkit-scrollbar {
            display: none;
          }

          .container > :global(.panel-wrapper) > :global(.panel.public-stack),
          .container > :global(.panel-wrapper) > :global(.panel.offshelf-stack) {
            width: 26rem;
          }

          .container > :global(.panel-wrapper) > :global(.panel.public-stack) {
            background-color: rgb(37, 116, 169);
          }

          .container :global(.panel-header-container) {
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 1rem;
            position: sticky;
            top: 0;
            padding: 0.5rem 0.5rem 0;
            background-color: #fff;
            z-index: 200;
            border-top-left-radius: 0.5rem;
            border-top-right-radius: 0.5rem;
          }

          .container
            > :global(.panel-wrapper)
            > :global(.panel.public-stack)
            > .panel-header-container {
            background-color: rgb(30, 139, 195);
            color: #fff;
          }

          .container > :global(.panel-wrapper) > :global(.public-stack) :global(.stack-card):hover {
            border-color: #000;
          }

          .container :global(.show-news-toggle) {
            background-color: #ddd;
          }

          .container :global(.show-news-toggle) > :global(.ant-switch-inner) {
            color: rgb(37, 116, 169);
          }

          .container > :global(.panel-wrapper) > :global(.y-scroll) {
            overflow-y: scroll;
          }
        `}
      </style>
    </>
  );
};

EventNewsroomPage.getInitialProps = async (
  ctx: ReduxNextPageContext
): Promise<IEventNewsroomPage.InitialProps> => {
  const eventId =
    (await UtilService.getEventIdMiddleware(ctx, '/newsroom', { needViewPermission: true })) || 0;

  if (eventId !== 0) {
    const messages = await RedstoneService.loadChatMessages('newsroom', Math.abs(eventId));
    const chatId = UtilService.getChatId('newsroom', Math.abs(eventId));
    ctx.store.dispatch(ChatroomActions.AddNewsroom(chatId, 'newsroom', Math.abs(eventId)));
    for (let i = 0; i < messages.length; i += 1) {
      ctx.store.dispatch(ChatroomActions.AddMessage(chatId, messages[i]));
    }
  }

  return {
    namespacesRequired: ['common'],
    eventId,
  };
};

export default EventNewsroomPage;
