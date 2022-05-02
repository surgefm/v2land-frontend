import { StacksState, StackAction } from '@Interfaces';

const removeNewsFromStack = (state: StacksState, action: StackAction) => {
  const { stackId, newsId } = action;
  if (!stackId || !newsId) return state;
  const stackIndex = state.idIndexMap[stackId];
  if (typeof stackIndex === 'undefined') return state;
  const stack = { ...state.list[stackIndex] };
  stack.newsIdList = stack.newsIdList || [];
  const index = stack.newsIdList.indexOf(newsId);
  if (index < 0) return state;
  stack.newsIdList.splice(index, 1);
  return {
    ...state,
    list: [...state.list.slice(0, stackIndex), stack, ...state.list.slice(stackIndex + 1)],
  };
};

export default removeNewsFromStack;
