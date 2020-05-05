import React from 'react';
import { Droppable } from 'react-beautiful-dnd';

import { NewsroomPanelNewsCard } from '../NewsCard';
import { INewsroomPanelNewsList } from './NewsList';

const NewsroomPanelNewsList: React.FunctionComponent<INewsroomPanelNewsList.IProps> = ({
  newsIdList,
  droppableId = 'newsroom-news-panel',
}) => (
  <Droppable droppableId={droppableId} type="NEWS">
    {provided => (
      <div ref={provided.innerRef} style={{ paddingBottom: '1px' }} {...provided.droppableProps}>
        {newsIdList.map((newsId, index) => (
          <NewsroomPanelNewsCard
            newsId={newsId}
            key={`news-${newsId}`}
            draggableId={`${droppableId}-news`}
            index={index}
          />
        ))}
        {provided.placeholder}
      </div>
    )}
  </Droppable>
);

export { NewsroomPanelNewsList };
