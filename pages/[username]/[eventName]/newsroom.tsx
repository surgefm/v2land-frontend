// #region Global Imports
import * as React from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { DragDropContext, OnDragEndResponder, resetServerContext } from 'react-beautiful-dnd';
import { PlusOutlined } from '@ant-design/icons';
// #endregion Global Imports

// #region Local Imports
import { withTranslation } from '@Server/i18n';
import { EventActions } from '@Actions';
import {
  Card,
  NewsroomPanelTitle,
  NewsroomPanelNewsList,
  NewsroomPanelStackList,
} from '@Components';
import { getEvent, getEventStackIdList, getEventNewsIdList } from '@Selectors';
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
  const newsIdList = useSelector(getEventNewsIdList(eventId));
  const stackIdList = useSelector(getEventStackIdList(eventId));
  if (!event) return <div />;

  const onDragEnd: OnDragEndResponder = result => {
    if (result.reason === 'CANCEL' || !result.destination) return;

    const { draggableId, destination, source } = result;
    console.log(draggableId, destination, source);
  };

  resetServerContext();

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="container">
        <div className="panel-wrapper">
          <Card className="panel">
            <NewsroomPanelTitle>备选新闻</NewsroomPanelTitle>
            <NewsroomPanelNewsList newsIdList={newsIdList} droppableId="newsroom-news-list" />
          </Card>
        </div>

        <div className="panel-wrapper">
          <Card className="panel">
            <NewsroomPanelTitle>备选进展</NewsroomPanelTitle>
            <button className="add-button" type="button">
              <PlusOutlined />
              <span>创建新进展</span>
            </button>
          </Card>
        </div>

        <div className="panel-wrapper">
          <Card className="panel public-stack">
            <NewsroomPanelTitle>事件进展</NewsroomPanelTitle>
            <NewsroomPanelStackList stackIdList={stackIdList} />
          </Card>
        </div>

        <style jsx>
          {`
            .container {
              min-width: 100%;
              height: 100vh;
              padding: 5rem 1rem 1rem 1rem;
              overflow-y: hidden;
              overflow-x: scroll;
              display: flex;
            }

            .panel-wrapper {
              min-width: 20rem;
              height: 100%;
              margin: 0 0.5rem;
            }

            .panel-wrapper > :global(.panel) {
              max-height: 100%;
              padding: 1.5rem 0.5rem 0.25rem;
            }

            .panel-wrapper > :global(.panel:not(.public-stack)) {
              max-width: 20rem;
            }

            .add-button {
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

            .add-button:hover {
              background-color: #f4f4f4;
            }

            .add-button span {
              margin-left: 0.25rem;
            }
          `}
        </style>
      </div>
    </DragDropContext>
  );
};

EventNewsroomPage.getInitialProps = async (
  ctx: ReduxNextPageContext
): Promise<IEventNewsroomPage.InitialProps> => {
  const { eventName } = ctx.query;

  if (!getEvent(+eventName)(ctx.store.getState())) {
    await ctx.store.dispatch(EventActions.GetEvent(+eventName));
  } else {
    ctx.store.dispatch(EventActions.GetEvent(+eventName));
  }

  return { namespacesRequired: ['common'] };
};

export default withTranslation('common')(EventNewsroomPage);
