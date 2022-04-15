import { createSelector } from 'reselect';
import { IStore } from '@Interfaces';
import { getEventOwnerId, getEventsState } from '@Selectors/events';

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
        if (state.list[i].username.toLowerCase() === name.toLowerCase()) return state.list[i].id;
      }
      return 0;
    }
  );

export const getClientWithUsername = (username: string) =>
  createSelector(
    (state: IStore) => state,
    getClientIdWithUsername(username),
    (state, id) => getClient(id)(state)
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

export const getEventOwner = (eventId: number) =>
  createSelector(
    (state: IStore) => state,
    getEventOwnerId(eventId),
    (state, id) => (id === null ? null : getClient(id)(state))
  );

export const getEventsOwnedByClient = (clientId: number) =>
  createSelector(
    getEventsState,
    state => state.list.filter(e => e.ownerId === clientId)
  );
