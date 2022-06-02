import { createSelector } from 'reselect';
import { IStore, TagsState } from '@Interfaces';
import { getLoggedInClient, getLoggedInClientId, isCurrentClientManager } from '@Selectors/clients';

export const getTagsState = (state: IStore) => state.tags;

type TagId = string | number;

const getTagFromState = (tagId: TagId) => (tagState: TagsState) => {
  let id = tagId;
  if (typeof id === 'string') id = tagState.nameIdMap[tagId];
  if (typeof id === 'undefined') return null;
  if (typeof tagState.idIndexMap[id] === 'undefined') return null;
  return tagState.list[tagState.idIndexMap[id]];
};

export const getTag = (tagId: TagId) =>
  createSelector(
    getTagsState,
    getTagFromState(tagId)
  );

export const getTagList = (tagIdList: TagId[]) =>
  createSelector(
    getTagsState,
    tagState => tagIdList.map(tagId => getTagFromState(tagId)(tagState))
  );

export const getTagEventIdList = (tagId: TagId) =>
  createSelector(
    getTag(tagId),
    tag => (tag ? tag.eventIdList : [])
  );

export const canCurrentClientManageTag = (tagId: TagId) =>
  createSelector(
    isCurrentClientManager,
    getLoggedInClient,
    getTag(tagId),
    (isManager, client, tag) => {
      if (isManager) return true;
      if (!client || !tag || !client.curatorRoles) return false;
      const hierarchyPath = (tag.hierarchyPath || []).filter(t => t !== tag.id);
      for (let i = 0; i < client.curatorRoles.length; i += 1) {
        if (hierarchyPath.includes(client.curatorRoles[i].tagId)) {
          return true;
        }
      }
      return false;
    }
  );

export const canCurrentClientEditTag = (tagId: TagId) =>
  createSelector(
    canCurrentClientManageTag(tagId),
    getLoggedInClientId,
    getTag(tagId),
    (canManage, clientId, tag) => {
      if (canManage) return true;
      if (!clientId || !tag) return false;
      return (tag.curatorIdList || []).includes(clientId);
    }
  );
