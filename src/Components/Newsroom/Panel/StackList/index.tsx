import React from 'react';
import { Droppable } from 'react-beautiful-dnd';

import { NewsroomPanelStackCard } from '../StackCard';
import { INewsroomPanelStackList } from './StackList';

const showPlaceholder = (stackIdList: number[]) => {
  if (stackIdList.length > 0) return <div />;
  return (
    <div>
      <span>将进展卡片拖拽到这里</span>
      <style jsx>
        {`
          div {
            height: calc(100% - 0.5rem);
            width: calc(100% - 1rem);
            display: flex;
            justify-content: center;
            align-items: center;
            position: absolute;
            top: 0.25rem;
            left: 0.5rem;
            padding: 0rem 0.5rem;
            background-color: #f4f4f4;
            border-radius: 0.25rem;
            user-select: none;
          }
        `}
      </style>
    </div>
  );
};

const NewsroomPanelStackList: React.FunctionComponent<INewsroomPanelStackList.IProps> = ({
  stackIdList,
  droppableId = 'newsroom-stack-panel',
}) => (
  <Droppable droppableId={droppableId} type="STACK">
    {provided => (
      <div ref={provided.innerRef} {...provided.droppableProps}>
        {stackIdList.map((stackId, index) => (
          <NewsroomPanelStackCard stackId={stackId} key={`stack-${stackId}`} index={index} />
        ))}
        {provided.placeholder}
        {showPlaceholder(stackIdList)}
        <style jsx>
          {`
            div {
              position: relative;
              padding: 0 0.5rem 0.5rem;
              min-height: 3rem;
              overflow-y: scroll;
            }
          `}
        </style>
      </div>
    )}
  </Droppable>
);

export { NewsroomPanelStackList };
