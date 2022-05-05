import { createSelector } from 'reselect';
import { IStore, Event } from '@Interfaces';

import { getNewsList } from '../news';
import { getStackList, getStackTime } from '../stacks';

export const getEventsState = (state: IStore) => state.events;

export const getEventId = (username: string = '', eventName: string | number = '') =>
  createSelector(
    getEventsState,
    state => {
      if (typeof eventName === 'number') return eventName;
      if (+eventName === +eventName) return +eventName;
      const split = eventName.split('-');
      if (+split[0] === +split[0]) return +split[0];
      return username.startsWith('@')
        ? state.nameIdMap[`${eventName}${username}`]
        : state.nameIdMap[`${eventName}@${username}`];
    }
  );

export const getEvent = (eventId: number) =>
  createSelector(
    getEventsState,
    eventState => {
      if (typeof eventState.idIndexMap[eventId] === 'undefined') return null;
      return eventState.list[eventState.idIndexMap[eventId]] as Event;
    }
  );

export const getEventList = (idList: number[]) => (state: IStore) =>
  idList.map(id => getEvent(id)(state));

export const getEventOwnerId = (eventId: number) =>
  createSelector(
    getEvent(eventId),
    event => (event ? event.ownerId : null)
  );

export const getEventStackIdList = (eventId: number) =>
  createSelector(
    getEvent(eventId),
    event => (event ? event.stackIdList : []) as number[]
  );

export const getEventContributorIdList = (eventId: number) =>
  createSelector(
    getEvent(eventId),
    event => {
      if (!event) return [] as number[];
      if (event.contributors) {
        return event.contributors.sort((a, b) => b.points - a.points).map(c => c.contributorId);
      }
      return (event.contributorIdList ? event.contributorIdList : []) as number[];
    }
  );

export const getEventOffshelfStackIdList = (eventId: number) =>
  createSelector(
    getEvent(eventId),
    event => (event ? event.offshelfStackIdList : []) as number[]
  );

export const getEventStackList = (eventId: number, sorted = false) =>
  createSelector(
    (state: IStore) => state,
    getEventStackIdList(eventId),
    (state, stackIdList) => getStackList(stackIdList, sorted)(state)
  );

export const getEventOffshelfStackList = (eventId: number, sorted = false) =>
  createSelector(
    (state: IStore) => state,
    getEventOffshelfStackIdList(eventId),
    (state, stackIdList) => getStackList(stackIdList, sorted)(state)
  );

export const isStackListSorted = (stackIdList: number[]) => (state: IStore) => {
  const list = stackIdList.map(id => ({ id, time: getStackTime(id)(state) }));
  for (let i = 0; i < list.length - 1; i += 1) {
    const stackA = list[i];
    const stackB = list[i + 1];
    if (stackA.time) {
      if (!stackB.time || new Date(stackA.time).getTime() < new Date(stackB.time).getTime()) {
        return false;
      }
    }
  }
  return true;
};

export const isEventStackListSorted = (eventId: number) =>
  createSelector(
    (state: IStore) => state,
    getEventStackIdList(eventId),
    (state, idList) => isStackListSorted(idList)(state)
  );

export const isEventOffshelfStackListSorted = (eventId: number) =>
  createSelector(
    (state: IStore) => state,
    getEventOffshelfStackIdList(eventId),
    (state, idList) => isStackListSorted(idList)(state)
  );

export const getEventNewsIdList = (eventId: number) =>
  createSelector(
    getEvent(eventId),
    event => (event ? event.newsIdList : []) as number[]
  );

export const getEventTemporaryStackNewsIdList = (eventId: number) =>
  createSelector(
    getEvent(eventId),
    event => (event ? event.temporaryStackNewsIdList : []) as number[]
  );

export const getEventOffshelfNewsIdList = (eventId: number) =>
  createSelector(
    getEvent(eventId),
    event => (event ? event.offshelfNewsIdList : []) as number[]
  );

export const getEventNewsList = (eventId: number, sorted = false) =>
  createSelector(
    (state: IStore) => state,
    getEventNewsIdList(eventId),
    (state, newsIdList) => getNewsList(newsIdList, sorted)(state)
  );

export const getEventOffshelfNewsList = (eventId: number, sorted = false) =>
  createSelector(
    (state: IStore) => state,
    getEventOffshelfNewsIdList(eventId),
    (state, newsIdList) => getNewsList(newsIdList, sorted)(state)
  );

export const getEventTemporaryStackNewsList = (eventId: number, sorted = false) =>
  createSelector(
    (state: IStore) => state,
    getEventTemporaryStackNewsIdList(eventId),
    (state, newsIdList) => getNewsList(newsIdList, sorted)(state)
  );

export const getEventStarCount = (eventId: number) =>
  createSelector(
    getEvent(eventId),
    event => (event ? event.starCount || 0 : 0)
  );

export const getEventTimeList = (eventIdList: number[]) => (state: IStore) =>
  eventIdList.map(id => {
    const event = getEvent(id)(state);
    if (!event) return null;
    if (event.time) return new Date(event.time);
    const stackIdList = getEventStackIdList(id)(state);
    if (stackIdList.length > 0) {
      return getStackTime(stackIdList[0])(state);
    }
    return event.latestAdmittedNews ? event.latestAdmittedNews.time : null;
  });
