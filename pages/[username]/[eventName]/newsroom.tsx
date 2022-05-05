// #region Global Imports
import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useSelector, useStore, useDispatch } from 'react-redux';
import {
  DragDropContext,
  OnDragEndResponder,
  resetServerContext,
  Droppable,
  Draggable,
  DraggableProvided,
  DraggableChildrenFn,
} from 'react-beautiful-dnd';
import { Switch, Tooltip, Space, Popover, message } from 'antd';
import {
  DragOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
// #endregion Global Imports

// #region Local Imports
import { useTranslation } from '@I18n';
import { NewsroomActions, ChatroomActions } from '@Actions';
import {
  getNewsroomSocket,
  closeNewsroomSocket,
  NewsroomSocket,
  handleNewsroomDragEnd,
  ClientService,
  UtilService,
  RedstoneService,
  usePrevious,
} from '@Services';
import { NewsroomPanelConsts } from '@Definitions';
import { Card, EventHead } from '@Components';
import {
  NewsroomPanelAddClientButton,
  NewsroomPanelAddNewsButton,
  NewsroomPanelTitle,
  NewsroomPanelNewsList,
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
  const [showChatroom, setShowChatroom] = useState(!!router.query.c);
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

  if (!event) return <div />;

  resetServerContext();

  const onDragEnd: OnDragEndResponder = result => {
    handleNewsroomDragEnd(result, eventId, store, socket);
  };

  const onStackNewsVisibilityToggled = (checked: boolean) => {
    dispatch(NewsroomActions.SetStackNewsVisible(checked));
  };

  const panels: { [index: string]: DraggableChildrenFn } = {
    [NewsroomPanelConsts.EventInformation]: (provided: DraggableProvided) => (
      <div className="panel-wrapper" ref={provided.innerRef} {...provided.draggableProps}>
        <Card className="panel y-scroll">
          <div className="panel-header-container">
            <NewsroomPanelTitle>事件信息</NewsroomPanelTitle>
            <DragOutlined {...provided.dragHandleProps} />
          </div>
          <NewsroomPanelEventDetail eventId={eventId} />
        </Card>
      </div>
    ),
    [NewsroomPanelConsts.EventRoleList]: (provided: DraggableProvided) => (
      <div className="panel-wrapper" ref={provided.innerRef} {...provided.draggableProps}>
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
            <Space size={0}>
              <NewsroomPanelAddClientButton eventId={eventId} />
              <DragOutlined {...provided.dragHandleProps} />
            </Space>
          </div>
          <NewsroomPanelRoleList eventId={eventId} />
        </Card>
      </div>
    ),
    [NewsroomPanelConsts.OffshelfNewsList]: (provided: DraggableProvided) => (
      <div className="panel-wrapper" ref={provided.innerRef} {...provided.draggableProps}>
        <Card className="panel">
          <div className="panel-header-container">
            <NewsroomPanelTitle>{t('Newsroom_OffshelfNews')}</NewsroomPanelTitle>
            <Space size={0}>
              <NewsroomPanelAddNewsButton eventId={eventId} />
              <DragOutlined {...provided.dragHandleProps} />
            </Space>
          </div>
          <NewsroomPanelNewsList
            newsIdList={offshelfNewsIdList}
            droppableId="newsroom-news-list"
            removable
          />
        </Card>
      </div>
    ),
    [NewsroomPanelConsts.OffshelfStackList]: (provided: DraggableProvided) => (
      <div className="panel-wrapper" ref={provided.innerRef} {...provided.draggableProps}>
        <Card className="panel offshelf-stack">
          <div className="panel-header-container">
            <NewsroomPanelTitle>{t('Newsroom_OffshelfStacks')}</NewsroomPanelTitle>
            <Space size={0}>
              <NewsroomPanelSortStacksButton eventId={eventId} offshelf />
              <NewsroomPanelCreateStackButton eventId={eventId} />
              <DragOutlined {...provided.dragHandleProps} />
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
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId={`newsroom-${eventId}-panels`} direction="horizontal">
        {droppableProvided => (
          <div
            className="container"
            ref={droppableProvided.innerRef}
            {...droppableProvided.droppableProps}
          >
            <EventHead eventId={eventId} title={t('Newsroom_Title')} />
            {showChatroom && (
              <ChatroomButton
                type="newsroom"
                ids={Math.abs(event.id)}
                openByDefault={!!router.query.c}
              />
            )}
            <div className="panel-wrapper">
              <Card className="panel public-stack">
                <div className="panel-header-container">
                  <NewsroomPanelTitle>{t('Newsroom_Timeline')}</NewsroomPanelTitle>
                  <Space size={0}>
                    <NewsroomPanelSortStacksButton eventId={eventId} />
                    <Tooltip
                      title={
                        showStackNews ? t('Newsroom_HideStackNews') : t('Newsroom_ShowStackNews')
                      }
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
            {newsroomPanels.map((panel, index) => (
              <Draggable draggableId={`newsroom-panel-${panel}`} index={index} key={panel}>
                {panels[panel]}
              </Draggable>
            ))}
            {droppableProvided.placeholder}
          </div>
        )}
      </Droppable>

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
    </DragDropContext>
  );
};

EventNewsroomPage.getInitialProps = async (
  ctx: ReduxNextPageContext
): Promise<IEventNewsroomPage.InitialProps> => {
  const eventId =
    (await UtilService.getEventIdMiddleware(ctx, '/newsroom', { needViewPermission: true })) || 0;

  const messages = await RedstoneService.loadChatMessages('newsroom', Math.abs(eventId));
  const chatId = UtilService.getChatId('newsroom', Math.abs(eventId));
  ctx.store.dispatch(ChatroomActions.AddNewsroom(chatId, 'newsroom', Math.abs(eventId)));
  for (let i = 0; i < messages.length; i += 1) {
    ctx.store.dispatch(ChatroomActions.AddMessage(chatId, messages[i]));
  }

  return {
    namespacesRequired: ['common'],
    eventId,
  };
};

export default EventNewsroomPage;
