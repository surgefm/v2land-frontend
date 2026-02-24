import React, { useRef, useEffect, useState } from 'react';
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { useTranslation } from '@I18n';
import { NewsListDropData } from '@Services/NewsroomDndControl/types';

import { NewsroomPanelNewsCard } from '../NewsCard';
import { INewsroomPanelNewsList } from './NewsList';

const showPlaceholder = (newsIdList: number[], t: (key: string) => string) => {
  const show = newsIdList.length === 0;

  return (
    <div>
      <span>{t('Newsroom_NewsList_DragSuggestion')}</span>
      <style jsx>
        {`
          div {
            width: calc(100% - 1rem);
            display: flex;
            justify-content: center;
            align-items: center;
            position: absolute;
            left: 0.5rem;
            padding: 0rem 0.5rem;
            background-color: rgb(232, 232, 232);
            opacity: ${show ? 1 : 0};
            border-radius: 0.25rem;
            user-select: none;
            transition: all 0.3s;
            z-index: 0;
          }
        `}
      </style>
    </div>
  );
};

const NewsroomPanelNewsListImpl: React.FunctionComponent<INewsroomPanelNewsList.IProps> = ({
  newsIdList,
  droppableId = 'newsroom-news-panel',
  isNested = false,
  removable = false,
  style,
}) => {
  const { t } = useTranslation('common');
  const ref = useRef<HTMLDivElement>(null);
  const [isDraggedOver, setIsDraggedOver] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    return dropTargetForElements({
      element: el,
      canDrop: ({ source }) => source.data.type === 'news',
      getData: (): NewsListDropData => ({
        type: 'news-list',
        droppableId,
      }),
      onDragEnter: ({ source }) => {
        if (source.data.sourceDroppableId !== droppableId) {
          setIsDraggedOver(true);
        }
      },
      onDragLeave: () => setIsDraggedOver(false),
      onDrop: () => setIsDraggedOver(false),
    });
  }, [droppableId]);

  return (
    <div style={style} ref={ref} className={isDraggedOver ? 'drag-over' : ''}>
      {newsIdList.map(newsId => (
        <NewsroomPanelNewsCard
          newsId={newsId}
          key={`news-${newsId}`}
          removable={removable}
          sourceDroppableId={droppableId}
        />
      ))}
      {isDraggedOver && (
        <div className="drop-indicator">
          <span>{t('Newsroom_NewsList_DropHere')}</span>
        </div>
      )}
      {showPlaceholder(newsIdList, t)}
      <style jsx>
        {`
          div {
            position: relative;
            padding: ${isNested ? '0 0 0.25rem' : '0 0.5rem 0.5rem'};
            min-height: ${isNested ? '2.5rem' : '3rem'};
            ${isNested ? '' : 'overflow-y: scroll'};
            transition: background-color 0.2s;
          }

          .drag-over {
            background-color: ${isNested ? 'rgba(0, 0, 0, 0.04)' : 'rgba(0, 0, 0, 0.03)'};
          }

          .drop-indicator {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 3.5rem;
            margin-top: 0.5rem;
            border-radius: 0.25rem;
            border: 2px dashed #bbb;
            background-color: rgba(0, 0, 0, 0.03);
          }

          .drop-indicator > span {
            color: #666;
            font-size: 13px;
            font-weight: 500;
            user-select: none;
          }

          div > :global(div:last-child) {
            width: ${isNested ? '100%' : 'calc(100% - 1rem)'};
            left: ${isNested ? '0' : '0.5rem'};
            top: ${isNested ? '0.3rem' : '0.5rem'};
            height: ${isNested ? 'calc(100% - 0.5rem)' : 'calc(100% - 1rem)'};
          }
        `}
      </style>
    </div>
  );
};

export const NewsroomPanelNewsList = NewsroomPanelNewsListImpl;
