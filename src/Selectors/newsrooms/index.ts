import { createSelector } from 'reselect';
import { IStore } from '@Interfaces';

export const getNewsroomsState = (state: IStore) => state.newsrooms;

export const getNewsroomPanels = createSelector(
  getNewsroomsState,
  state => state.panels
);
