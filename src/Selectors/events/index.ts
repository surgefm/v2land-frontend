import { createSelector } from 'reselect';
import { IStore } from '@Interfaces';

import {
  getEventStackIdList,
  getEventNewsIdList,
  getEventOffshelfNewsIdList,
  getEventTemporaryStackNewsIdList,
} from '../eventStackNews';
import { getNewsList } from '../news';
import { getStackList } from '../stacks';

export const getEventsState = (state: IStore) => state.events;

export const getEvent = (eventId: number) =>
  createSelector(
    getEventsState,
    eventState => {
      if (typeof eventState.idIndexMap[eventId] === 'undefined') return null;
      return eventState.list[eventState.idIndexMap[eventId]];
    }
  );

export const getEventStackList = (eventId: number, sorted = false) =>
  createSelector(
    state => state,
    getEventStackIdList(eventId),
    (state, stackIdList) => getStackList(stackIdList, sorted)(state)
  );

export const getEventNewsList = (eventId: number, sorted = false) =>
  createSelector(
    state => state,
    getEventNewsIdList(eventId),
    (state, newsIdList) => getNewsList(newsIdList, sorted)(state)
  );

export const getEventOffshelfNewsList = (eventId: number, sorted = false) =>
  createSelector(
    state => state,
    getEventOffshelfNewsIdList(eventId),
    (state, newsIdList) => getNewsList(newsIdList, sorted)(state)
  );

export const getEventTemporaryStackNewsList = (eventId: number, sorted = false) =>
  createSelector(
    state => state,
    getEventTemporaryStackNewsIdList(eventId),
    (state, newsIdList) => getNewsList(newsIdList, sorted)(state)
  );
