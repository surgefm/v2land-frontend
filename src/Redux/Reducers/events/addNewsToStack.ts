import { EventsState, StackAction } from '@Interfaces';

const addNewsToStack = (state: EventsState, action: StackAction) => {
  const { stackId, newsId } = action;
  if (!stackId || !newsId) return state;
  const eventIndex = state.list.findIndex(e => (e.stackIdList || []).includes(stackId));
  if (typeof eventIndex === 'undefined') return state;
  const event = { ...state.list[eventIndex] };
  event.newsIdList = event.newsIdList || [];
  if (!event.newsIdList.includes(newsId)) {
    event.newsIdList.push(newsId);
  }
  if (event.offshelfNewsIdList.includes(newsId)) {
    event.offshelfNewsIdList.splice(event.offshelfNewsIdList.indexOf(newsId), 1);
  }

  return {
    ...state,
    list: [...state.list.slice(0, eventIndex), event, state.list.slice(eventIndex + 1)],
  };
};

export default addNewsToStack;
