import { createSelector } from 'reselect';
import { IStore, TagsState } from '@Interfaces';

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
