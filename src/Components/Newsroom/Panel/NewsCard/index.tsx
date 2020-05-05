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
    <Draggable draggableId={`${draggableId}-${newsId}`} index={index || 0}>
      {provided => (
        <div ref={provided.innerRef} {...provided.dragHandleProps} {...provided.draggableProps}>
          <NewsroomPanelCard className="news-card">
            {`${news.source} | ${news.title} | ${news.id}`}
          </NewsroomPanelCard>
          <style jsx>
            {`
              div {
                width: 100%;
              }

              div > :global(.news-card) {
                white-space: nowrap;
                overflow-x: scroll;
              }
            `}
          </style>
        </div>
      )}
    </Draggable>
  );
};

export { NewsroomPanelNewsCard };
