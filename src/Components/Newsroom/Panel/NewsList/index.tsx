import React from 'react';
import { Droppable } from 'react-beautiful-dnd';

import { NewsroomPanelNewsCard } from '../NewsCard';
import { INewsroomPanelNewsList } from './NewsList';

const showPlaceholder = (newsIdList: number[]) => {
  if (newsIdList.length > 0) return <div />;
  return (
    <div>
      <span>将新闻卡片拖拽到这里</span>
      <style jsx>
        {`
          div {
            height: calc(100% - 0.5rem);
            display: flex;
            justify-content: center;
            align-items: center;
            position: absolute;
            top: 0.25rem;
            left: 0.5rem;
            padding: 0rem 0.5rem;
            background-color: rgb(232, 232, 232);
            border-radius: 0.25rem;
            user-select: none;
          }
        `}
      </style>
    </div>
  );
};

const NewsroomPanelNewsList: React.FunctionComponent<INewsroomPanelNewsList.IProps> = ({
  newsIdList,
  droppableId = 'newsroom-news-panel',
  isNested = false,
}) => (
  <Droppable droppableId={droppableId} type="NEWS">
    {provided => (
      <div ref={provided.innerRef} {...provided.droppableProps}>
        {newsIdList.map((newsId, index) => (
          <NewsroomPanelNewsCard
            newsId={newsId}
            key={`news-${newsId}`}
            draggableId={`${droppableId}-news`}
            index={index}
          />
        ))}
        {provided.placeholder}
        {showPlaceholder(newsIdList)}
        <style jsx>
          {`
            div {
              position: relative;
              padding: ${isNested ? '0 0 0.5rem' : '0 0.5rem 0.5rem'};
              min-height: 3rem;
              overflow-y: scroll;
              margin-top: ${isNested ? '0' : '0.2rem'};
            }

            div > :global(div:last-child) {
              width: ${isNested ? '100%' : 'calc(100% - 1rem)'};
              left: ${isNested ? '0' : '0.5rem'};
            }
          `}
        </style>
      </div>
    )}
  </Droppable>
);

export { NewsroomPanelNewsList };
