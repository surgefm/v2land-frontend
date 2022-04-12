import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { TFunction } from 'next-i18next';

import { useTranslation } from '@I18n';

import { NewsroomPanelStackCard } from '../StackCard';
import { INewsroomPanelStackList } from './StackList';

const showPlaceholder = (stackIdList: number[], t: TFunction) => {
  if (stackIdList.length > 0) return <div />;
  return (
    <div>
      <span>{t('Newsroom_StackList_DragSuggestion')}</span>
      <style jsx>
        {`
          div {
            height: calc(100% - 1rem);
            width: calc(100% - 1rem);
            display: flex;
            justify-content: center;
            align-items: center;
            position: absolute;
            top: 0.5rem;
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

const NewsroomPanelStackListImpl: React.FunctionComponent<INewsroomPanelStackList.IProps> = ({
  stackIdList,
  droppableId = 'newsroom-stack-panel',
}) => {
  const { t } = useTranslation('common');
  const dark = droppableId !== 'newsroom-stack-panel';

  return (
    <Droppable droppableId={droppableId} type="STACK">
      {provided => (
        <div ref={provided.innerRef} {...provided.droppableProps}>
          {stackIdList.map((stackId, index) => (
            <NewsroomPanelStackCard
              stackId={stackId}
              dark={dark}
              key={`stack-${stackId}`}
              index={index}
            />
          ))}
          {provided.placeholder}
          {showPlaceholder(stackIdList, t)}
          <style jsx>
            {`
              div {
                position: relative;
                padding: 0 0.5rem 0.5rem;
                min-height: 4rem;
                overflow-y: scroll;
                max-height: calc(100vh - 6rem);
              }

              div::-webkit-scrollbar {
                display: none;
              }
            `}
          </style>
        </div>
      )}
    </Droppable>
  );
};

export const NewsroomPanelStackList = NewsroomPanelStackListImpl;
