import { createSelector } from 'reselect';
import { IStore } from '@Interfaces';

import {
  getLoggedInClientId,
  isCurrentClientEditor,
  isCurrentClientManager,
} from '@Selectors/clients';
import { getEvent } from '@Selectors/events';

export const getNewsroomsState = (state: IStore) => state.newsrooms;

export const getActiveNewsroomId = createSelector(
  getNewsroomsState,
  state => state.activeNewsroom
);

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

export const isNewsroomClientInvitationVisible = createSelector(
  getNewsroomsState,
  state => state.showClientInvitation
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

export const getActiveNewsroom = createSelector(
  (state: IStore) => state,
  getActiveNewsroomId,
  (state, eventId) => getNewsroom(eventId)(state)
);

export const isNewsroomSocketConnected = (eventId?: number) =>
  createSelector(
    eventId ? getNewsroom(eventId) : getActiveNewsroom,
    newsroom => (newsroom ? newsroom.socketStatus === 'connected' : false)
  );

export const getAgentStatus = (eventId?: number) =>
  createSelector(
    eventId ? getNewsroom(eventId) : getActiveNewsroom,
    newsroom => (newsroom ? newsroom.agentStatus : null)
  );

export const getAgentRun = (eventId?: number) =>
  createSelector(
    eventId ? getNewsroom(eventId) : getActiveNewsroom,
    newsroom => (newsroom ? newsroom.agentRun : null)
  );

export const getNewsroomClients = (eventId: number) =>
  createSelector(
    getNewsroom(eventId),
    newsroom => (newsroom && newsroom.clients ? newsroom.clients : [])
  );

export const getNewsroomRoles = (eventId: number) =>
  createSelector(
    getNewsroom(eventId),
    newsroom => (newsroom === null ? null : newsroom.roles)
  );

export const getNewsroomAllClientIds = (eventId: number) =>
  createSelector(
    getNewsroomRoles(eventId),
    roles =>
      roles === null ? [] : [...roles.owners, ...roles.managers, ...roles.editors, ...roles.viewers]
  );

export const getNewsroomClientRole = (eventId: number, clientId: number) =>
  createSelector(
    getNewsroomRoles(eventId),
    isCurrentClientEditor,
    isCurrentClientManager,
    (roles, isEditor, isManager) => {
      if (roles === null) return null;
      if (roles.owners.includes(clientId)) return 'owner';
      if (roles.managers.includes(clientId)) return 'manager';
      if (isManager) return 'manager';
      if (roles.editors.includes(clientId)) return 'editor';
      if (roles.viewers.includes(clientId)) return 'viewer';
      if (isEditor) return 'editor';
      return 'passerby';
    }
  );

export const getNewsroomCurrentClientRole = (eventId?: number) =>
  createSelector(
    (state: IStore) => state,
    getLoggedInClientId,
    getActiveNewsroomId,
    (state, clientId, newsroomId) =>
      getNewsroomClientRole((eventId || newsroomId) as number, clientId)(state)
  );

export const canCurrentClientViewEvent = (eventId?: number) =>
  createSelector(
    getEvent(eventId || 0),
    getNewsroomCurrentClientRole(eventId),
    (event, role) => {
      if (event && event.status === 'admitted') return true;
      return role && role !== 'passerby';
    }
  );

export const canCurrentClientEditEvent = (eventId?: number) =>
  createSelector(
    getNewsroomCurrentClientRole(eventId),
    role => role === 'editor' || role === 'manager' || role === 'owner'
  );

export const canCurrentClientManageEvent = (eventId?: number) =>
  createSelector(
    getNewsroomCurrentClientRole(eventId),
    role => role === 'manager' || role === 'owner'
  );

export const isCurrentClientEventOwner = (eventId?: number) =>
  createSelector(
    getNewsroomCurrentClientRole(eventId),
    role => role === 'owner'
  );

export const getResourceLocker = (model: string, resourceId: number, eventId?: number) =>
  createSelector(
    eventId ? getNewsroom(eventId) : getActiveNewsroom,
    newsroom => {
      if (newsroom === null) return 0;
      return newsroom.resourceLocks[`${model}-${Math.abs(resourceId)}`] || 0;
    }
  );

export const isResourceLocked = (model: string, resourceId: number, eventId?: number) =>
  createSelector(
    getResourceLocker(model, resourceId, eventId),
    getLoggedInClientId,
    (locker, clientId) => locker !== 0 && locker !== clientId
  );
