import React from 'react';
import { useSelector } from 'react-redux';
import { Draggable } from 'react-beautiful-dnd';

import { getStack, getStackNewsIdList, isStackNewsVisible } from '@Selectors';
// import { GetNews } from '@Actions';
import { NewsroomPanelCard } from '../Card';
import { NewsroomPanelNewsList } from '../NewsList';
import { INewsroomPanelStackCard } from './StackCard';

const NewsroomPanelStackCard: React.FunctionComponent<INewsroomPanelStackCard.IProps> = ({
  stackId,
  index,
}) => {
  const stack = useSelector(getStack(stackId));
  const newsIdList = useSelector(getStackNewsIdList(stackId));
  const showStackNews = useSelector(isStackNewsVisible);
  if (!stack) return <div />;

  return (
    <Draggable draggableId={`stack-card-${Math.abs(stackId)}`} index={index || 0}>
      {provided => (
        <div ref={provided.innerRef} {...provided.dragHandleProps} {...provided.draggableProps}>
          <NewsroomPanelCard className="stack-card">
            <span>{stack.title}</span>
            <NewsroomPanelNewsList
              style={showStackNews ? {} : { display: 'none' }}
              newsIdList={newsIdList}
              droppableId={`stack-card-${Math.abs(stackId)}-news-list`}
              isNested
            />
          </NewsroomPanelCard>
          <style jsx>
            {`
              div {
                width: 25rem;
              }

              div {
                margin-top: 0.5rem;
              }

              div > :global(.stack-card) {
                background-color: #f4f4f4;
                border-width: 1.5px;
              }

              div > :global(.stack-card:hover) {
                border-color: #999;
              }
            `}
          </style>
        </div>
      )}
    </Draggable>
  );
};

export { NewsroomPanelStackCard };
