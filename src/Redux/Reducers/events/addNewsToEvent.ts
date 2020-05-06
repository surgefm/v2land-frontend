import { EventsState, EventAction } from '@Interfaces';

const addNewsToEvent = (state: EventsState, action: EventAction) => {
  if (!action.newsId || !action.eventId) return state;
  const { eventId, newsId, isInTemporaryStack } = action;
  const index = state.idIndexMap[eventId];
  if (typeof index === 'undefined') return state;
  const event = state.list[index];
  if (isInTemporaryStack) {
    if (event.temporaryStackNewsIdList.includes(newsId)) return state;
    event.temporaryStackNewsIdList.push(newsId);
  }

  if (!event.newsIdList.includes(newsId)) {
    event.newsIdList.push(newsId);
  }

  return {
    ...state,
    list: [...state.list.slice(0, index), event, ...state.list.slice(index + 1)],
  };
};

export default addNewsToEvent;
