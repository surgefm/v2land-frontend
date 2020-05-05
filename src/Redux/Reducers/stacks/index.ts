// #region Local Imports
import { ActionConsts } from '@Definitions';
// #endregion Local Imports

// #region Interface Imports
import { StackAction, StacksState, EventAction } from '@Interfaces';
// #endregion Interface Imports

const INITIAL_STATE: StacksState = {
  list: [],
  idIndexMap: {},
};

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

const addNewsToStack = (state: StacksState, action: StackAction) => {
  const { stackId, newsId } = action;
  if (!stackId || !newsId) return state;
  const stackIndex = state.idIndexMap[stackId];
  if (typeof stackIndex === 'undefined') return state;
  const stack = { ...state.list[stackIndex] };
  stack.newsIdList = stack.newsIdList || [];
  if (stack.newsIdList.includes(newsId)) return state;
  stack.newsIdList.push(newsId);
  return {
    ...state,
    list: [...state.list.slice(0, stackIndex), stack, ...state.list.slice(stackIndex + 1)],
  };
};

export const StackReducer = (state = INITIAL_STATE, action: StackAction) => {
  switch (action.type) {
    case ActionConsts.Stack.AddStack:
    case ActionConsts.Stack.UpdateStack: {
      if (!action.stack) return state;
      const stackId = action.stackId || action.stack.id;
      if (!stackId) return state;
      const stack = { ...action.stack };
      stack.newsIdList = stack.newsIdList || [];
      if (stack.news) {
        stack.newsIdList = stack.news.map(n => n.id);
      }
      delete stack.news;
      const newState = { ...state };
      const index = state.idIndexMap[stackId];
      if (typeof index !== 'undefined') {
        newState.list[index] = stack;
        return newState;
      }
      newState.idIndexMap[stackId] = newState.list.length;
      newState.list.push(stack);
      return newState;
    }
    case ActionConsts.Event.AddNewsToEvent:
      return addNewsToEvent(state, action);
    case ActionConsts.Stack.AddNewsToStack:
      return addNewsToStack(state, action);
    default:
      return state;
  }
};
