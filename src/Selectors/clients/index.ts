import { createSelector } from 'reselect';
import { IStore } from '@Interfaces';

export const getClientsState = (state: IStore) => state.clients;

export const isLoggedIn = createSelector(
  getClientsState,
  state => state.clientId !== -1
);

export const getLoggedInClientId = createSelector(
  getClientsState,
  state => state.clientId
);

export const getLoggedInClient = createSelector(
  getClientsState,
  state => state.list[state.idIndexMap[state.clientId]]
);

export const getClient = (clientId: number) =>
  createSelector(
    getClientsState,
    state => {
      if (typeof state.idIndexMap[clientId] === 'undefined') return null;
      return state.list[state.idIndexMap[clientId]];
    }
  );

export const getClientList = (clientIds: number[]) =>
  createSelector(
    getClientsState,
    state =>
      clientIds.map(clientId => {
        if (typeof state.idIndexMap[clientId] === 'undefined') return null;
        return state.list[state.idIndexMap[clientId]];
      })
  );
