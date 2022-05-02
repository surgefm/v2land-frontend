import { createSelector } from 'reselect';
import { IStore } from '@Interfaces';

import { getEventList } from '../events';

export const getHomepageState = (state: IStore) => state.homepage || {};

export const getHomepageEventIdList = createSelector(
  getHomepageState,
  state => state.eventList || []
);

export const getHomepageEventList = createSelector(
  (state: IStore) => state,
  getHomepageEventIdList,
  (state, idList) => getEventList(idList)(state)
);
