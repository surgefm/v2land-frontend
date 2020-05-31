import React from 'react';
import { useSelector } from 'react-redux';
import { Draggable } from 'react-beautiful-dnd';

import { getNews, canCurrentClientEditEvent, isNewsroomSocketConnected } from '@Selectors';
import { NewsroomPanelCard } from '../Card';
import { INewsroomPanelNewsCard } from './NewsCard';

const NewsroomPanelNewsCard: React.FunctionComponent<INewsroomPanelNewsCard.IProps> = ({
  newsId,
  index,
  draggableId = 'news-card',
}) => {
  const news = useSelector(getNews(newsId));
  const canEdit = useSelector(canCurrentClientEditEvent());
  const isConnected = useSelector(isNewsroomSocketConnected());
  if (!news) return <div />;

  return (
    <Draggable
      draggableId={`${draggableId}-${Math.abs(newsId)}`}
      index={index || 0}
      isDragDisabled={!canEdit || !isConnected}
    >
      {(provided, snapshot) => (
        <div
          className={snapshot.isDragging ? 'dragging' : ''}
          ref={provided.innerRef}
          {...provided.dragHandleProps}
          {...provided.draggableProps}
        >
          <NewsroomPanelCard className="news-card">
            {`${news.source} | ${news.title}}`}
          </NewsroomPanelCard>
          <style jsx>
            {`
              div {
                width: 100%;
                z-index: 1;
                position: relative;
              }

              div > :global(.news-card) {
                white-space: nowrap;
                overflow-x: hidden;
              }

              div > :global(.news-card::-webkit-scrollbar) {
                display: none;
              }

              .dragging > :global(.news-card) {
                border: 1px solid #555;
              }

              div {
                margin-top: 0.5rem;
              }
            `}
          </style>
        </div>
      )}
    </Draggable>
  );
};

export { NewsroomPanelNewsCard };
