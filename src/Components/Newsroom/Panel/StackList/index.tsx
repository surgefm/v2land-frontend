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
            height: 2.5rem;
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            position: absolute;
            top: 0.25rem;
            left: 0;
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
              padding-bottom: 1px;
              min-height: 3rem;
            }
          `}
        </style>
      </div>
    )}
  </Droppable>
);

export { NewsroomPanelStackList };
