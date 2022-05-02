import { EventsState, EventAction } from '@Interfaces';

const removeNewsFromEvent = (state: EventsState, action: EventAction) => {
  if (!action.newsId || !action.eventId) return state;
  const { eventId, newsId } = action;
  const index = state.idIndexMap[eventId];
  if (typeof index === 'undefined') return state;
  const event = { ...state.list[index] };
  if (event.offshelfNewsIdList.includes(newsId)) {
    event.offshelfNewsIdList.splice(event.offshelfNewsIdList.indexOf(newsId), 1);
  }

  return {
    ...state,
    list: [...state.list.slice(0, index), event, ...state.list.slice(index + 1)],
  };
};

export default removeNewsFromEvent;
