// #region Global Imports
import * as React from 'react';
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
import { PlusOutlined, DragOutlined } from '@ant-design/icons';
// #endregion Global Imports

// #region Local Imports
import { withTranslation } from '@Server/i18n';
import { EventActions } from '@Actions';
import { getNewsroomSocket, NewsroomSocket, handleNewsroomDragEnd } from '@Services';
import {
  Card,
  NewsroomPanelTitle,
  NewsroomPanelNewsList,
  NewsroomPanelStackList,
  NewsroomPanelEventDetail,
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
  const eventId = +router.query.eventName;
  const event = useSelector(getEvent(eventId));
  const offshelfNewsIdList = useSelector(getEventOffshelfNewsIdList(eventId));
  const offshelfStackIdList = useSelector(getEventOffshelfStackIdList(eventId));
  const stackIdList = useSelector(getEventStackIdList(eventId));
  const newsroomPanels = useSelector(getNewsroomPanels);
  const store = useStore();
  const socket = getNewsroomSocket(eventId, store) as NewsroomSocket;
  if (!event) return <div />;

  resetServerContext();

  const onDragEnd: OnDragEndResponder = result => {
    handleNewsroomDragEnd(result, eventId, store, socket);
  };

  const panels: { [index: string]: DraggableChildrenFn } = {
    'event-information': (provided: DraggableProvided) => (
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
    'offshelf-news-list': (provided: DraggableProvided) => (
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
    'offshelf-stack-list': (provided: DraggableProvided) => (
      <div className="panel-wrapper" ref={provided.innerRef} {...provided.draggableProps}>
        <Card className="panel offshelf-stack">
          <div className="panel-header-container">
            <NewsroomPanelTitle>备选进展</NewsroomPanelTitle>
            <DragOutlined {...provided.dragHandleProps} />
          </div>
          <button className="add-button" type="button">
            <PlusOutlined />
            <span>创建新进展</span>
          </button>
          <NewsroomPanelStackList
            droppableId="newsroom-offshelf-stack-panel"
            stackIdList={offshelfStackIdList}
          />
        </Card>
      </div>
    ),
    'stack-list': (provided: DraggableProvided) => (
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
            padding: 1.5rem 0.5rem 0.25rem;
            width: 25rem;
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
          }

          .container :global(.add-button) {
            border: none;
            font-size: 1rem;
            display: flex;
            justify-content: flex-end;
            align-items: center;
            width: 100%;
            padding: 0.25rem 0.5rem;
            cursor: pointer;
            transition: all 0.2s;
            border-radius: 0.25rem;
          }

          .container :global(.add-button):hover {
            background-color: #f4f4f4;
          }

          .container :global(.add-button) span {
            margin-left: 0.25rem;
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
