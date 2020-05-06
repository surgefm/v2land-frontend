import React from 'react';
import { Droppable } from 'react-beautiful-dnd';

import { NewsroomPanelStackCard } from '../StackCard';
import { INewsroomPanelStackList } from './StackList';

const NewsroomPanelStackList: React.FunctionComponent<INewsroomPanelStackList.IProps> = ({
  stackIdList,
  droppableId = 'newsroom-stack-panel',
}) => (
  <Droppable droppableId={droppableId} type="STACK">
    {provided => (
      <div ref={provided.innerRef} style={{ paddingBottom: '1px' }} {...provided.droppableProps}>
        {stackIdList.map((stackId, index) => (
          <NewsroomPanelStackCard stackId={stackId} key={`stack-${stackId}`} index={index} />
        ))}
        {provided.placeholder}
      </div>
    )}
  </Droppable>
);

export { NewsroomPanelStackList };
