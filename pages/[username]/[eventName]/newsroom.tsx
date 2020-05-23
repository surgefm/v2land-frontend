// #region Global Imports
import React, { useEffect } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useSelector, useStore } from 'react-redux';
import {
  DragDropContext,
  OnDragEndResponder,
  resetServerContext,
  Droppable,
  Draggable,
  DraggableProvided,
  DraggableChildrenFn,
} from 'react-beautiful-dnd';
import { DragOutlined } from '@ant-design/icons';
// #endregion Global Imports

// #region Local Imports
import { withTranslation } from '@Server/i18n';
import { EventActions } from '@Actions';
import {
  getNewsroomSocket,
  closeNewsroomSocket,
  NewsroomSocket,
  handleNewsroomDragEnd,
} from '@Services';
import { NewsroomPanelConsts } from '@Definitions';
import {
  Card,
  NewsroomPanelTitle,
  NewsroomPanelNewsList,
  NewsroomPanelStackList,
  NewsroomPanelEventDetail,
  NewsroomPanelCreateStackButton,
} from '@Components';
import {
  getEvent,
  getEventStackIdList,
  getEventOffshelfNewsIdList,
  getEventOffshelfStackIdList,
  getNewsroomPanels,
} from '@Selectors';
// #endregion Local Imports

// #region Interface Imports
import { IEventNewsroomPage, ReduxNextPageContext } from '@Interfaces';
// #endregion Interface Imports

const EventNewsroomPage: NextPage<
  IEventNewsroomPage.IProps,
  IEventNewsroomPage.InitialProps
> = () => {
  const router = useRouter();
  const eventId = -router.query.eventName;
  const event = useSelector(getEvent(eventId));
  const offshelfNewsIdList = useSelector(getEventOffshelfNewsIdList(eventId));
  const offshelfStackIdList = useSelector(getEventOffshelfStackIdList(eventId));
  const stackIdList = useSelector(getEventStackIdList(eventId));
  const newsroomPanels = useSelector(getNewsroomPanels);
  const store = useStore();
  const socket = getNewsroomSocket(eventId, store) as NewsroomSocket;

  useEffect(() => {
    return () => closeNewsroomSocket(eventId);
  }, []);

  if (!event) return <div />;

  resetServerContext();

  const onDragEnd: OnDragEndResponder = result => {
    handleNewsroomDragEnd(result, eventId, store, socket);
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
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <NewsroomPanelCreateStackButton eventId={eventId} />
              <DragOutlined {...provided.dragHandleProps} />
            </div>
          </div>
          <NewsroomPanelStackList
            droppableId="newsroom-offshelf-stack-panel"
            stackIdList={offshelfStackIdList}
          />
        </Card>
      </div>
    ),
    [NewsroomPanelConsts.StackList]: (provided: DraggableProvided) => (
      <div className="panel-wrapper" ref={provided.innerRef} {...provided.draggableProps}>
        <Card className="panel public-stack">
          <div className="panel-header-container">
            <NewsroomPanelTitle>事件时间线</NewsroomPanelTitle>
            <DragOutlined {...provided.dragHandleProps} />
          </div>
          <NewsroomPanelStackList stackIdList={stackIdList} />
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
          }

          .container > :global(.panel-wrapper) > :global(.panel.public-stack),
          .container > :global(.panel-wrapper) > :global(.panel.offshelf-stack) {
            width: 26rem;
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
        `}
      </style>
    </DragDropContext>
  );
};

EventNewsroomPage.getInitialProps = async (
  ctx: ReduxNextPageContext
): Promise<IEventNewsroomPage.InitialProps> => {
  const { eventName } = ctx.query;

  await ctx.store.dispatch(EventActions.GetEvent(+eventName, true));

  return { namespacesRequired: ['common'] };
};

export default withTranslation('common')(EventNewsroomPage);
