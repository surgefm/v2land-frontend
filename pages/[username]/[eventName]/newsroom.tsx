// #region Global Imports
import React, { useEffect, useRef, useState } from 'react';
import { NextPage } from 'next';
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
  QuestionCircleTwoTone,
} from '@ant-design/icons';
// #endregion Global Imports

// #region Local Imports
import { withTranslation } from '@Server/i18n';
import { EventActions, NewsroomActions } from '@Actions';
import {
  getNewsroomSocket,
  closeNewsroomSocket,
  NewsroomSocket,
  handleNewsroomDragEnd,
  ClientService,
  UtilService,
} from '@Services';
import { NewsroomPanelConsts } from '@Definitions';
import {
  Card,
  NewsroomPanelAddClientButton,
  NewsroomPanelTitle,
  NewsroomPanelNewsList,
  NewsroomPanelStackList,
  NewsroomPanelEventDetail,
  NewsroomPanelCreateStackButton,
  NewsroomPanelRoleList,
} from '@Components';
import {
  getEvent,
  getEventId,
  getEventStackIdList,
  getEventOffshelfNewsIdList,
  getEventOffshelfStackIdList,
  getNewsroomPanels,
  isStackNewsVisible,
  isLoggedIn,
  canCurrentClientViewEvent,
  getNewsroomCurrentClientRole,
} from '@Selectors';
// #endregion Local Imports

// #region Interface Imports
import { IEventNewsroomPage, ReduxNextPageContext } from '@Interfaces';
// #endregion Interface Imports

const EventNewsroomPage: NextPage<
  IEventNewsroomPage.IProps,
  IEventNewsroomPage.InitialProps
> = () => {
  function usePrevious<T>(value: T) {
    const ref = useRef<T>();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  }

  const router = useRouter();
  const username = router.query.username as string;
  const eventName = router.query.eventName as string;
  const id = -Math.abs(useSelector(getEventId(username, eventName)));
  const [eventId] = useState(id);
  const event = useSelector(getEvent(eventId));
  const prevEvent = usePrevious(event);
  const offshelfNewsIdList = useSelector(getEventOffshelfNewsIdList(eventId));
  const offshelfStackIdList = useSelector(getEventOffshelfStackIdList(eventId));
  const stackIdList = useSelector(getEventStackIdList(eventId));
  const newsroomPanels = useSelector(getNewsroomPanels);
  const showStackNews = useSelector(isStackNewsVisible);
  const canView = useSelector(canCurrentClientViewEvent(eventId));
  const prevCanView = usePrevious(canView);
  const role = useSelector(getNewsroomCurrentClientRole(eventId));
  const prevRole = usePrevious(role);
  const store = useStore();
  const dispatch = useDispatch();
  let socket = getNewsroomSocket(eventId, store) as NewsroomSocket;

  useEffect(() => {
    dispatch(NewsroomActions.SetActiveNewsroom(eventId));
    return () => {
      NewsroomActions.SetActiveNewsroom(0);
      closeNewsroomSocket(eventId);
    };
  }, []);

  useEffect(() => {
    if (prevRole && role && role !== prevRole) {
      message.info(`你已被设为该事件的「${ClientService.getRoleName(role)}」`);
    }
  }, [role]);

  useEffect(() => {
    if (!canView && canView !== prevCanView) {
      message.error('你没有查看该新闻编辑室的权限');
      UtilService.redirect('/');
    }
  }, [canView]);

  useEffect(() => {
    if (prevEvent && event.name !== prevEvent.name) {
      UtilService.redirect(`/${username}/${event.name}/newsroom`, { replace: true });
    }
  }, [event.name]);

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
        <Card className="panel">
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
        <Card className="panel">
          <div className="panel-header-container">
            <Space size={0}>
              <NewsroomPanelTitle>用户列表</NewsroomPanelTitle>
              <Popover
                // eslint-disable-next-line prettier/prettier
                content={(
                  <>
                    <p>
                      <b>观察者</b>
                      ：可以查看时间线的最新编辑情况，但不可以进行编辑
                    </p>
                    <p>
                      <b>编辑者</b>
                      ：可以对时间线进行编辑
                    </p>
                    <p>
                      <b>管理者</b>
                      ：可以添加或移除编辑者和观察者
                    </p>
                    <span>
                      <b>所有者</b>
                      ：可以添加或移除管理者
                    </span>
                  </>
                  // eslint-disable-next-line prettier/prettier
                )}
              >
                <QuestionCircleTwoTone />
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
            <NewsroomPanelTitle>备选新闻</NewsroomPanelTitle>
            <DragOutlined {...provided.dragHandleProps} />
          </div>
          <NewsroomPanelNewsList newsIdList={offshelfNewsIdList} droppableId="newsroom-news-list" />
        </Card>
      </div>
    ),
    [NewsroomPanelConsts.OffshelfStackList]: (provided: DraggableProvided) => (
      <div className="panel-wrapper" ref={provided.innerRef} {...provided.draggableProps}>
        <Card className="panel offshelf-stack">
          <div className="panel-header-container">
            <NewsroomPanelTitle>备选进展</NewsroomPanelTitle>
            <Space size={0}>
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
            <div className="panel-wrapper">
              <Card className="panel public-stack">
                <div className="panel-header-container">
                  <NewsroomPanelTitle>事件时间线</NewsroomPanelTitle>
                  <Tooltip title={showStackNews ? '隐藏新闻' : '显示新闻'}>
                    <Switch
                      checkedChildren={<EyeOutlined />}
                      unCheckedChildren={<EyeInvisibleOutlined />}
                      className="show-news-toggle"
                      onClick={onStackNewsVisibilityToggled}
                      defaultChecked={showStackNews}
                    />
                  </Tooltip>
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
            width: fit-content;
            position: relative;
          }

          .container {
            min-width: 100%;
            height: 100vh;
            padding: 5rem 1rem 1rem 1rem;
            overflow-y: hidden;
            overflow-x: scroll;
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
        `}
      </style>
    </DragDropContext>
  );
};

EventNewsroomPage.getInitialProps = async (
  ctx: ReduxNextPageContext
): Promise<IEventNewsroomPage.InitialProps> => {
  const props = { namespacesRequired: ['common'] };

  const loggedIn = isLoggedIn(ctx.store.getState());
  if (!loggedIn) {
    UtilService.redirect(ctx, encodeURI(`/login?redirect=${ctx.asPath}`));
    return props;
  }

  const eventName = ctx.query.eventName as string;
  let username = ctx.query.username as string;

  if (username.startsWith('@')) {
    username = username.slice(1);
  }
  await ctx.store.dispatch(EventActions.GetEvent(eventName, username as string, true));
  const eventId = getEventId(username, eventName)(ctx.store.getState());
  const event = getEvent(eventId)(ctx.store.getState());
  if (!event) {
    UtilService.redirect(ctx, '/?event_not_found=1');
  }

  return props;
};

export default withTranslation('common')(EventNewsroomPage);
