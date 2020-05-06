import { StacksState, EventAction } from '@Interfaces';

const addNewsToEvent = (state: StacksState, action: EventAction) => {
  if (!action.newsId || !action.eventId) return state;
  const { eventId, stackId, newsId, isInTemporaryStack } = action;
  const previousStackIndex = state.list.findIndex(
    s => s.eventId === eventId && (s.newsIdList || []).includes(newsId)
  );
  const previousStack = { ...state.list[previousStackIndex] };
  if (typeof previousStackIndex !== 'undefined') {
    previousStack.newsIdList = (previousStack.newsIdList || []).filter(id => id !== newsId);
  }

  if (isInTemporaryStack) {
    if (typeof previousStackIndex !== 'undefined') {
      return {
        ...state,
        list: [
          ...state.list.slice(0, previousStackIndex),
          previousStack,
          ...state.list.slice(previousStackIndex + 1),
        ],
      };
    }
    return state;
  }

  if (!stackId) return state;

  const index = state.idIndexMap[stackId];
  if (typeof index === 'undefined') return state;

  const stack = { ...state.list[index] };
  stack.newsIdList = stack.newsIdList || [];
  if (!stack.newsIdList.includes(newsId)) {
    stack.newsIdList.push(newsId);
  }
  let newList = [...state.list.slice(0, index), stack, ...state.list.slice(index + 1)];
  if (typeof previousStackIndex !== 'undefined') {
    newList = [
      ...newList.slice(0, previousStackIndex),
      previousStack,
      ...newList.slice(previousStackIndex + 1),
    ];
  }

  return { ...state, newList };
};

export default addNewsToEvent;
