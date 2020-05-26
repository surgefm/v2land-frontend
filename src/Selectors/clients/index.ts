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

export const getClientIdWithUsername = (username: string) =>
  createSelector(
    getClientsState,
    state => {
      const name = username.startsWith('@') ? username.slice(1) : username;
      for (let i = 0; i < state.list.length; i += 1) {
        if (state.list[i].username === name) return state.list[i].id;
      }
      return 0;
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
