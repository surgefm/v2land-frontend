import { createSelector } from 'reselect';
import { IStore } from '@Interfaces';

export const getClientsState = (state: IStore) => state.clients;

export const isLoggedIn = createSelector(
  getClientsState,
  state => state.clientId !== -1
);

export const getLoggedInClient = createSelector(
  getClientsState,
  state => state.list[state.clientId]
);

export const getClient = (clientId: number) =>
  createSelector(
    getClientsState,
    state => {
      if (typeof state.idIndexMap[clientId] === 'undefined') return null;
      return state.list[state.idIndexMap[clientId]];
    }
  );
