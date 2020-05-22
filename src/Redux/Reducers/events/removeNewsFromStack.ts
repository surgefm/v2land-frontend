import { EventsState, StackAction } from '@Interfaces';

const removeNewsFromStack = (state: EventsState, action: StackAction) => {
  const { stackId, newsId } = action;
  if (!stackId || !newsId) return state;
  const eventIndex = state.list.findIndex(
    e => e.stackIdList.includes(stackId) || e.offshelfStackIdList.includes(stackId)
  );
  if (eventIndex < 0) return state;
  const event = { ...state.list[eventIndex] };
  if (!event.offshelfNewsIdList.includes(newsId)) {
    event.offshelfNewsIdList.push(newsId);
  }
  if (event.newsIdList.includes(newsId)) {
    event.newsIdList.splice(event.newsIdList.indexOf(newsId), 1);
  }

  return {
    ...state,
    list: [...state.list.slice(0, eventIndex), event, state.list.slice(eventIndex + 1)],
  };
};

export default removeNewsFromStack;
