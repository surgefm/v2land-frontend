import React, { useRef, useEffect, useLayoutEffect } from 'react';
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;
import { useTranslation } from '@I18n';
import {
  StackListDropData,
  getDestinationIndex,
} from '@Services/NewsroomDndControl/types';
import { consumeLocalReorderFlag } from '@Services/NewsroomDndControl/handleStackDragEnd';

import { NewsroomPanelStackCard } from '../StackCard';
import { INewsroomPanelStackList } from './StackList';

const showPlaceholder = (stackIdList: number[], t: (key: string) => string) => {
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

  // Indicator state managed via refs + direct DOM manipulation.
  // No layout shifts — indicators are always full height, just change visibility.
  const activeSlotRef = useRef<number | null>(null);
  const lastValidSlotRef = useRef<number | null>(null);
  const indicatorRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cardMidpointsRef = useRef<number[]>([]);

  // FLIP animation: snapshot card positions and order for animating remote reorders.
  const prevRectsRef = useRef<Map<number, DOMRect>>(new Map());
  const prevOrderRef = useRef<number[]>([]);

  // useLayoutEffect fires before paint — compute deltas and start FLIP animation.
  useIsomorphicLayoutEffect(() => {
    if (consumeLocalReorderFlag()) return;

    const prevRects = prevRectsRef.current;
    if (prevRects.size === 0) return;

    const prevOrder = prevOrderRef.current;
    const movedIds = new Set<number>();
    if (prevOrder.length > 0) {
      const prevIndexMap = new Map<number, number>();
      prevOrder.forEach((id, i) => prevIndexMap.set(id, i));
      stackIdList.forEach((id, newIdx) => {
        const oldIdx = prevIndexMap.get(id);
        if (oldIdx !== undefined && oldIdx !== newIdx) {
          movedIds.add(id);
        }
      });
    }

    stackIdList.forEach((stackId, idx) => {
      if (!movedIds.has(stackId)) return;
      const el = cardRefs.current[idx];
      if (!el) return;
      const prevRect = prevRects.get(stackId);
      if (!prevRect) return;
      const newRect = el.getBoundingClientRect();
      const deltaY = prevRect.top - newRect.top;
      if (Math.abs(deltaY) < 1) return;

      el.style.transform = `translateY(${deltaY}px) scale(1.03)`;
      el.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)';
      el.style.zIndex = '10';
      el.style.transition = 'none';

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          el.style.transition =
            'transform 0.35s cubic-bezier(0.2,0,0,1), box-shadow 0.35s ease';
          el.style.transform = 'none';
          el.style.boxShadow = 'none';
          const cleanup = () => {
            el.style.zIndex = '';
            el.style.transition = '';
            el.removeEventListener('transitionend', cleanup);
          };
          el.addEventListener('transitionend', cleanup);
        });
      });
    });
  }, [stackIdList]);

  // useEffect fires after paint — snapshot positions and order for the *next* reorder.
  useEffect(() => {
    const rects = new Map<number, DOMRect>();
    stackIdList.forEach((stackId, idx) => {
      const el = cardRefs.current[idx];
      if (el) rects.set(stackId, el.getBoundingClientRect());
    });
    prevRectsRef.current = rects;
    prevOrderRef.current = [...stackIdList];
  }, [stackIdList]);

  const indicatorColor = dark ? 'rgb(37, 116, 169)' : '#fff';

  function setActiveIndicator(slot: number | null) {
    const prev = activeSlotRef.current;
    if (prev === slot) return;
    if (prev !== null && indicatorRefs.current[prev]) {
      indicatorRefs.current[prev]!.style.backgroundColor = '';
    }
    if (slot !== null && indicatorRefs.current[slot]) {
      indicatorRefs.current[slot]!.style.backgroundColor = indicatorColor;
      lastValidSlotRef.current = slot;
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

  function computeSlotFromCursor(
    clientY: number,
    sourceData: Record<string | symbol, unknown>
  ): number | null {
    const midpoints = cardMidpointsRef.current;
    if (midpoints.length === 0) return null;

    let slot = midpoints.length;
    for (let i = 0; i < midpoints.length; i++) {
      if (clientY < midpoints[i]) {
        slot = i;
        break;
      }
    }

    // No-op suppression: don't show indicator if card would stay at its position.
    if (sourceData.sourceDroppableId === droppableId) {
      const srcIndex = sourceData.index as number;
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

    // Self-stackId suppression
    const sourceStackId = sourceData.stackId as number;
    for (let i = 0; i < cardRefs.current.length; i++) {
      const el = cardRefs.current[i];
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      if (clientY >= rect.top && clientY <= rect.bottom) {
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
        activeSlot: activeSlotRef.current ?? lastValidSlotRef.current,
      }),
      onDragEnter: () => {
        if (cardMidpointsRef.current.length === 0) {
          snapshotCardMidpoints();
        }
      },
      onDrag: ({ source, location }) => {
        if (cardMidpointsRef.current.length === 0) {
          snapshotCardMidpoints();
        }
        const clientY = location.current.input.clientY;
        const slot = computeSlotFromCursor(clientY, source.data);
        setActiveIndicator(slot);
      },
      onDragLeave: () => {
        setActiveIndicator(null);
        lastValidSlotRef.current = null;
        cardMidpointsRef.current = [];
      },
      onDrop: () => {
        setActiveIndicator(null);
        lastValidSlotRef.current = null;
        cardMidpointsRef.current = [];
      },
    });
  }, [droppableId, stackIdList]);

  // Indicator bar: zero height in flow so it doesn't affect spacing.
  // The visible bar is the inner span, centered over the gap via transform.
  const indicator = (slot: number) => (
    <div className="indicator" key={`ind-${slot}`}>
      <span
        ref={el => { indicatorRefs.current[slot] = el; }}
      />
      <style jsx>
        {`
          .indicator {
            height: 0;
            position: relative;
            z-index: 1;
            pointer-events: none;
          }
          span {
            position: absolute;
            left: 0;
            right: 0;
            top: 3px;
            height: 2px;
            border-radius: 1px;
            transition: background-color 0.12s ease;
          }
        `}
      </style>
    </div>
  );

  return (
    <div ref={ref}>
      {stackIdList.map((stackId, idx) => (
        <React.Fragment key={`stack-${stackId}`}>
          {indicator(idx)}
          <NewsroomPanelStackCard
            stackId={stackId}
            dark={dark}
            index={idx}
            sourceDroppableId={droppableId}
            cardRef={el => { cardRefs.current[idx] = el; }}
          />
        </React.Fragment>
      ))}
      {indicator(stackIdList.length)}
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
  );
};

export const NewsroomPanelStackList = NewsroomPanelStackListImpl;
