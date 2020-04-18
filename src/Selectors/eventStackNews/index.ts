import { createSelector } from 'reselect';
import { IStore, Stack } from '@Interfaces';
import { getStack } from '../stacks';

export const getEsnState = (state: IStore) => state.esns;

export const getStackNewsIdList = (stackId: number) =>
  createSelector(
    getEsnState,
    state =>
      state.list
        .filter(esn => esn.stackId === stackId && esn.newsId)
        .map(esn => esn.newsId as number)
  );

export const getEventAllStackIdList = (eventId: number) =>
  createSelector(
    getEsnState,
    esnState =>
      esnState.list
        .filter(esn => esn.eventId === eventId && esn.stackId)
        .map(esn => esn.stackId as number)
        .filter((stackId, index, array) => array.indexOf(stackId) === index)
  );

export const getEventStackIdList = (eventId: number) =>
  createSelector(
    state => state,
    getEventAllStackIdList(eventId),
    (state, stackIdList) =>
      stackIdList
        .map(stackId => getStack(stackId)(state))
        .filter(stack => stack && stack.order && stack.order >= 0)
        .sort((a, b) => ((a as Stack).order || -1) - ((b as Stack).order || -1))
        .map(stack => (stack as Stack).id)
  );

export const getEventOffshelfStackIdList = (eventId: number) =>
  createSelector(
    state => state,
    getEventAllStackIdList(eventId),
    (state, stackIdList) =>
      stackIdList.filter(stackId => {
        const stack = getStack(stackId)(state);
        if (!stack) return false;
        return !stack.order || stack.order < 0;
      })
  );

export const getEventNewsIdList = (eventId: number) =>
  createSelector(
    getEsnState,
    state =>
      state.list
        .filter(esn => esn.eventId === eventId && esn.newsId)
        .map(esn => esn.newsId as number)
  );

export const getEventTemporaryStackNewsIdList = (eventId: number) =>
  createSelector(
    getEsnState,
    state =>
      state.list
        .filter(esn => esn.eventId === eventId && esn.newsId && esn.isInTemporaryStack)
        .map(esn => esn.newsId as number)
  );

export const getEventOffshelfNewsIdList = (eventId: number) =>
  createSelector(
    getEsnState,
    state =>
      state.list
        .filter(esn => esn.eventId === eventId && !esn.stackId && !esn.isInTemporaryStack)
        .map(esn => esn.newsId as number)
  );
