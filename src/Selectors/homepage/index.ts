import { createSelector } from 'reselect';
import { IStore } from '@Interfaces';

import { getEventList } from '../events';

export const getHomepageState = (state: IStore) => state.homepage || {};

export const getHomepageEventIdList = createSelector(
  getHomepageState,
  state => {
    let eventList: number[] = [];
    for (let i = 0; i < state.eventList.length; i += 1) {
      eventList = eventList.concat(state.eventList[i]);
    }
    eventList = eventList.filter((id, index) => eventList.indexOf(id) === index);
    return eventList;
  }
);

export const getHomepageEventList = createSelector(
  (state: IStore) => state,
  getHomepageEventIdList,
  (state, idList) => getEventList(idList)(state)
);
