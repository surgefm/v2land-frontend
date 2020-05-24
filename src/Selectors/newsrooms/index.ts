import { createSelector } from 'reselect';
import { IStore } from '@Interfaces';

export const getNewsroomsState = (state: IStore) => state.newsrooms;

export const getNewsroomPanels = createSelector(
  getNewsroomsState,
  state => state.panels
);

export const isStackNewsVisible = createSelector(
  getNewsroomsState,
  state => state.showStackNews
);

export const isIndividualStackNewsVisible = (stackId: number) =>
  createSelector(
    getNewsroomsState,
    state => state.stackNewsVisibility[Math.abs(stackId)] || false
  );

export const getNewsroom = (eventId: number) =>
  createSelector(
    getNewsroomsState,
    state => {
      const id = -Math.abs(eventId);
      if (typeof state.idIndexMap[id] === 'undefined') return null;
      return state.list[state.idIndexMap[id]];
    }
  );

export const getNewsroomClients = (eventId: number) =>
  createSelector(
    getNewsroom(eventId),
    newsroom => (newsroom === null ? [] : newsroom.clients)
  );
