import React, { useRef, useEffect, useState } from 'react';
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { TFunction } from 'next-i18next';

import { useTranslation } from '@I18n';
import {
  StackListDropData,
  getDestinationIndex,
} from '@Services/NewsroomDndControl/types';

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
  const ref = useRef<HTMLDivElement>(null);
  const [isDraggedOver, setIsDraggedOver] = useState(false);

  // Gap indicator state managed via refs + direct DOM manipulation to avoid
  // React re-render delays that cause flicker feedback loops.
  const activeSlotRef = useRef<number | null>(null);
  const gapRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  // Snapshot of card midpoints captured at drag start (before any gaps open).
  // Using stable positions prevents feedback loops from layout shifts.
  const cardMidpointsRef = useRef<number[]>([]);

  function setActiveGap(slot: number | null) {
    const prev = activeSlotRef.current;
    if (prev === slot) return;
    if (prev !== null && gapRefs.current[prev]) {
      gapRefs.current[prev]!.style.height = '0';
    }
    if (slot !== null && gapRefs.current[slot]) {
      gapRefs.current[slot]!.style.height = '4rem';
    }
    activeSlotRef.current = slot;
  }

  function snapshotCardMidpoints() {
    cardMidpointsRef.current = cardRefs.current.map(el => {
      if (!el) return 0;
      const rect = el.getBoundingClientRect();
      return rect.top + rect.height / 2;
    });
  }

  // Compute which slot the cursor falls in using the snapshotted midpoints.
  // Returns slot 0..N where slot i means "before card i" and slot N means "after last card".
  function computeSlotFromCursor(
    clientY: number,
    sourceData: Record<string | symbol, unknown>
  ): number | null {
    const midpoints = cardMidpointsRef.current;
    if (midpoints.length === 0) return null;

    // Find the slot: cursor above midpoint[0] → slot 0, between midpoint[i-1] and midpoint[i] → slot i, etc.
    let slot = midpoints.length; // default: after last card
    for (let i = 0; i < midpoints.length; i++) {
      if (clientY < midpoints[i]) {
        slot = i;
        break;
      }
    }

    // Self-hover suppression: if dragging within the same list, don't show indicator
    // when the card would end up at its original position.
    if (sourceData.sourceDroppableId === droppableId) {
      const srcIndex = sourceData.index as number;
      // Compute the edge equivalent for getDestinationIndex:
      // slot i with edge 'top' on card i, or slot i with edge 'bottom' on card i-1
      let targetIndex: number;
      let edge: 'top' | 'bottom';
      if (slot < midpoints.length) {
        targetIndex = slot;
        edge = 'top';
      } else {
        targetIndex = midpoints.length - 1;
        edge = 'bottom';
      }
      if (getDestinationIndex(targetIndex, edge, srcIndex) === srcIndex) {
        return null;
      }
    }

    // Self-stackId suppression: if cursor is on the dragged card itself, no indicator.
    const sourceStackId = sourceData.stackId as number;
    // Find which card the cursor is directly over
    for (let i = 0; i < cardRefs.current.length; i++) {
      const el = cardRefs.current[i];
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      if (clientY >= rect.top && clientY <= rect.bottom) {
        // Cursor is over card i — check if it's the dragged card
        if (stackIdList[i] !== undefined && Math.abs(stackIdList[i]) === sourceStackId) {
          return null;
        }
        break;
      }
    }

    return slot;
  }

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    return dropTargetForElements({
      element: el,
      canDrop: ({ source }) => source.data.type === 'stack',
      getData: (): StackListDropData => ({
        type: 'stack-list',
        droppableId,
      }),
      onDragEnter: ({ source }) => {
        if (source.data.sourceDroppableId !== droppableId) {
          setIsDraggedOver(true);
        }
        // Snapshot card positions on first entry (before any gap opens).
        if (cardMidpointsRef.current.length === 0) {
          snapshotCardMidpoints();
        }
      },
      onDrag: ({ source, location }) => {
        // Snapshot on first drag if not yet captured (e.g. dragging within same list).
        if (cardMidpointsRef.current.length === 0) {
          snapshotCardMidpoints();
        }
        const clientY = location.current.input.clientY;
        const slot = computeSlotFromCursor(clientY, source.data);
        setActiveGap(slot);
      },
      onDragLeave: () => {
        setIsDraggedOver(false);
        setActiveGap(null);
        cardMidpointsRef.current = [];
      },
      onDrop: () => {
        setIsDraggedOver(false);
        setActiveGap(null);
        cardMidpointsRef.current = [];
      },
    });
  }, [droppableId, stackIdList]);

  // Render a gap div for each slot. Always in the DOM, height controlled imperatively via style.height.
  const gap = (slot: number) => (
    <div className="gap" ref={el => { gapRefs.current[slot] = el; }} key={`gap-${slot}`}>
      <div className="gap-inner" />
      <style jsx>
        {`
          .gap {
            height: 0;
            overflow: hidden;
            transition: height 0.15s ease-out;
            pointer-events: none;
          }
          .gap-inner {
            height: 4rem;
            border-radius: 0.25rem;
            border: 2px dashed rgb(37, 116, 169);
            background-color: rgba(37, 116, 169, 0.06);
          }
        `}
      </style>
    </div>
  );

  return (
    <div ref={ref} className={isDraggedOver ? 'drag-over' : ''}>
      {stackIdList.map((stackId, idx) => (
        <React.Fragment key={`stack-${stackId}`}>
          {gap(idx)}
          <NewsroomPanelStackCard
            stackId={stackId}
            dark={dark}
            index={idx}
            sourceDroppableId={droppableId}
            cardRef={el => { cardRefs.current[idx] = el; }}
          />
        </React.Fragment>
      ))}
      {gap(stackIdList.length)}
      {isDraggedOver && (
        <div className="drop-indicator">
          <span>{t('Newsroom_StackList_DropHere')}</span>
        </div>
      )}
      {showPlaceholder(stackIdList, t)}
      <style jsx>
        {`
          div {
            position: relative;
            padding: 0 0.5rem 0.5rem;
            min-height: 4rem;
            overflow-y: scroll;
            max-height: calc(100vh - 6rem);
            transition: background-color 0.2s;
          }

          .drag-over {
            background-color: rgba(0, 0, 0, 0.03);
          }

          .drop-indicator {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 4rem;
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

          div::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>
    </div>
  );
};

export const NewsroomPanelStackList = NewsroomPanelStackListImpl;
