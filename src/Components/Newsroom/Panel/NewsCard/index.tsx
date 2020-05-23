import React from 'react';
import { useSelector } from 'react-redux';
import { Draggable } from 'react-beautiful-dnd';

import { getNews } from '@Selectors';
// import { GetNews } from '@Actions';
import { NewsroomPanelCard } from '../Card';
import { INewsroomPanelNewsCard } from './NewsCard';

const NewsroomPanelNewsCard: React.FunctionComponent<INewsroomPanelNewsCard.IProps> = ({
  newsId,
  index,
  draggableId = 'news-card',
}) => {
  const news = useSelector(getNews(newsId));
  if (!news) return <div />;

  return (
    <Draggable draggableId={`${draggableId}-${Math.abs(newsId)}`} index={index || 0}>
      {provided => (
        <div ref={provided.innerRef} {...provided.dragHandleProps} {...provided.draggableProps}>
          <NewsroomPanelCard className="news-card">
            {`${news.source} | ${news.title} | ${Math.abs(news.id)}`}
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
                overflow-x: scroll;
              }

              div > :global(.news-card::-webkit-scrollbar) {
                display: none;
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
