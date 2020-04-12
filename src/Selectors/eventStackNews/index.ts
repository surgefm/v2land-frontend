import { createSelector } from 'reselect';
import { IStore } from '@Interfaces';

export const getEsnState = (state: IStore) => state.esns;

export const getStackNewsIdList = (stackId: number) =>
  createSelector(
    getEsnState,
    state =>
      state.list
        .filter(esn => esn.stackId === stackId && esn.newsId)
        .map(esn => esn.newsId as number)
  );

export const getEventStackIdList = (eventId: number) =>
  createSelector(
    getEsnState,
    state =>
      state.list
        .filter(esn => esn.eventId === eventId && esn.stackId)
        .map(esn => esn.stackId as number)
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
        .filter(
          esn => esn.eventId === eventId && esn.newsId && esn.isInTemporaryStack
        )
        .map(esn => esn.newsId as number)
  );

export const getEventOffshelfNewsIdList = (eventId: number) =>
  createSelector(
    getEsnState,
    state =>
      state.list
        .filter(
          esn =>
            esn.eventId === eventId && !esn.stackId && !esn.isInTemporaryStack
        )
        .map(esn => esn.newsId as number)
  );
