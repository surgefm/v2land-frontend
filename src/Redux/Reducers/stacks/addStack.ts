import { StacksState, StackAction } from '@Interfaces';

const addStack = (state: StacksState, action: StackAction) => {
  if (!action.stack) return state;
  const stackId = action.stackId || action.stack.id;
  if (!stackId) return state;
  const index = state.idIndexMap[stackId];
  const stack =
    typeof index === 'undefined' ? action.stack : { ...state.list[index], ...action.stack };
  stack.newsIdList = stack.newsIdList || [];
  stack.time = stack.time ? new Date(stack.time) : undefined;
  if (stack.news) {
    stack.newsIdList = stack.news.map(n => n.id);
  }
  delete stack.news;
  const newState = { ...state };
  if (typeof index !== 'undefined') {
    newState.list[index] = stack;
    return newState;
  }
  newState.idIndexMap[stackId] = newState.list.length;
  newState.list.push(stack);
  return newState;
};

export default addStack;
