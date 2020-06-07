import { EventsState, TagAction } from '@Interfaces';

const removeEventFromTag = (state: EventsState, action: TagAction) => {
  if (!action.tagId || !action.eventId) return state;
  const { eventId, tagId } = action;
  const index = state.idIndexMap[eventId];
  if (typeof index === 'undefined') return state;
  const event = { ...state.list[index] };
  if (event.offshelfNewsIdList.includes(tagId)) {
    event.offshelfNewsIdList.splice(event.offshelfNewsIdList.indexOf(tagId), 1);
  }

  return {
    ...state,
    list: [...state.list.slice(0, index), event, ...state.list.slice(index + 1)],
  };
};

export default removeEventFromTag;
