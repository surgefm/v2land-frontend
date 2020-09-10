import { TagsState, TagAction } from '@Interfaces';

export default function removeEventFromTag(state: TagsState, action: TagAction) {
  if (!action.tagId || !action.eventId) return state;
  const { tagId, eventId } = action;
  const index = state.idIndexMap[tagId];
  if (typeof index === 'undefined') return state;
  if (!state.list[index].eventIdList.includes(eventId)) return state;
  const newTag = {
    ...state.list[index],
    eventIdList: state.list[index].eventIdList.filter(id => id !== eventId),
  };
  return {
    ...state,
    list: [...state.list.slice(0, index), newTag, ...state.list.slice(index + 1)],
  };
}
