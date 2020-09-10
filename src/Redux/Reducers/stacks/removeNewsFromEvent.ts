import { StacksState, EventAction } from '@Interfaces';

const removeNewsFromEvent = (state: StacksState, action: EventAction) => {
  if (!action.newsId || !action.eventId) return state;
  const { eventId, newsId } = action;
  const previousStackIndex = state.list.findIndex(
    s => s.eventId === eventId && (s.newsIdList || []).includes(newsId)
  );
  if (previousStackIndex < 0) return state;
  const previousStack = { ...state.list[previousStackIndex] };
  previousStack.newsIdList = (previousStack.newsIdList || []).filter(id => id !== newsId);

  return {
    ...state,
    list: [
      ...state.list.slice(0, previousStackIndex),
      previousStack,
      ...state.list.slice(previousStackIndex + 1),
    ],
  };
};

export default removeNewsFromEvent;
