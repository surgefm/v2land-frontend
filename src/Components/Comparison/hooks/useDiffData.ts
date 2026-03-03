import { useSelector } from 'react-redux';
import { IStore } from '@Interfaces';
import {
  getEvent,
  getEventStackIdList,
  getStack,
  getStackNewsIdList,
  getStackTime,
} from '@Selectors';

export type ChangeStatus = 'added' | 'removed' | 'modified' | 'unchanged';

export interface StackDiff {
  absStackId: number;
  status: ChangeStatus;
  baseStackId: number | null;
  targetStackId: number | null;
  titleChanged: boolean;
  descriptionChanged: boolean;
  timeChanged: boolean;
  newsAdded: number[];
  newsRemoved: number[];
  orderChanged: boolean;
}

export interface EventDiff {
  nameChanged: boolean;
  descriptionChanged: boolean;
}

export interface DiffResult {
  eventDiff: EventDiff;
  stackDiffs: StackDiff[];
  hasChanges: boolean;
  baseOrder: number[];
  targetOrder: number[];
}

function computeDiff(state: IStore, baseEventId: number, targetEventId: number): DiffResult {
  const baseEvent = getEvent(baseEventId)(state);
  const targetEvent = getEvent(targetEventId)(state);

  const eventDiff: EventDiff = {
    nameChanged: (baseEvent?.name || '') !== (targetEvent?.name || ''),
    descriptionChanged: (baseEvent?.description || '') !== (targetEvent?.description || ''),
  };

  const baseStackIds = getEventStackIdList(baseEventId)(state);
  const targetStackIds = getEventStackIdList(targetEventId)(state);

  const baseAbsIds = new Set(baseStackIds.map(id => Math.abs(id)));
  const targetAbsIds = new Set(targetStackIds.map(id => Math.abs(id)));

  const allAbsIds = new Set([...baseAbsIds, ...targetAbsIds]);

  const stackDiffs: StackDiff[] = [];

  allAbsIds.forEach(absId => {
    const inBase = baseAbsIds.has(absId);
    const inTarget = targetAbsIds.has(absId);

    const baseId = inBase ? Math.abs(absId) : null;
    const targetId = inTarget ? -Math.abs(absId) : null;

    if (!inBase && inTarget) {
      stackDiffs.push({
        absStackId: absId,
        status: 'added',
        baseStackId: null,
        targetStackId: targetId,
        titleChanged: false,
        descriptionChanged: false,
        timeChanged: false,
        newsAdded: [],
        newsRemoved: [],
        orderChanged: false,
      });
      return;
    }

    if (inBase && !inTarget) {
      stackDiffs.push({
        absStackId: absId,
        status: 'removed',
        baseStackId: baseId,
        targetStackId: null,
        titleChanged: false,
        descriptionChanged: false,
        timeChanged: false,
        newsAdded: [],
        newsRemoved: [],
        orderChanged: false,
      });
      return;
    }

    // Both exist — compare fields
    const baseStack = getStack(baseId!)(state);
    const targetStack = getStack(targetId!)(state);

    const titleChanged = (baseStack?.title || '') !== (targetStack?.title || '');
    const descriptionChanged =
      (baseStack?.description || '') !== (targetStack?.description || '');

    const baseTime = getStackTime(baseId!)(state);
    const targetTime = getStackTime(targetId!)(state);
    const timeChanged =
      (baseTime ? baseTime.getTime() : 0) !== (targetTime ? targetTime.getTime() : 0);

    const baseNewsIds = getStackNewsIdList(baseId!)(state).map(id => Math.abs(id));
    const targetNewsIds = getStackNewsIdList(targetId!)(state).map(id => Math.abs(id));

    const baseNewsSet = new Set(baseNewsIds);
    const targetNewsSet = new Set(targetNewsIds);

    const newsAdded = targetNewsIds.filter(id => !baseNewsSet.has(id));
    const newsRemoved = baseNewsIds.filter(id => !targetNewsSet.has(id));

    const baseOrder = baseStack?.order;
    const targetOrder = targetStack?.order;
    const orderChanged = baseOrder !== targetOrder;

    const hasFieldChanges =
      titleChanged ||
      descriptionChanged ||
      timeChanged ||
      newsAdded.length > 0 ||
      newsRemoved.length > 0 ||
      orderChanged;

    stackDiffs.push({
      absStackId: absId,
      status: hasFieldChanges ? 'modified' : 'unchanged',
      baseStackId: baseId,
      targetStackId: targetId,
      titleChanged,
      descriptionChanged,
      timeChanged,
      newsAdded,
      newsRemoved,
      orderChanged,
    });
  });

  const hasChanges =
    eventDiff.nameChanged ||
    eventDiff.descriptionChanged ||
    stackDiffs.some(d => d.status !== 'unchanged');

  return {
    eventDiff,
    stackDiffs,
    hasChanges,
    baseOrder: baseStackIds.map(id => Math.abs(id)),
    targetOrder: targetStackIds.map(id => Math.abs(id)),
  };
}

export function useDiffData(baseEventId: number, targetEventId: number): DiffResult {
  return useSelector((state: IStore) => computeDiff(state, baseEventId, targetEventId));
}
