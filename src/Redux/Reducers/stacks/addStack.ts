import { StacksState, StackAction } from '@Interfaces';

const addStack = (state: StacksState, action: StackAction) => {
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
};

export default addStack;
