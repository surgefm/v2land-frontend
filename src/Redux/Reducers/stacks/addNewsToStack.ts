import { StacksState, StackAction } from '@Interfaces';

const addNewsToStack = (state: StacksState, action: StackAction) => {
  const { stackId, newsId } = action;
  if (!stackId || !newsId) return state;
  const stackIndex = state.idIndexMap[stackId];
  if (typeof stackIndex === 'undefined') return state;
  const stack = { ...state.list[stackIndex] };
  stack.newsIdList = stack.newsIdList || [];
  if (stack.newsIdList.includes(newsId)) return state;
  let newList = [...state.list.slice(0, stackIndex), stack, ...state.list.slice(stackIndex + 1)];

  const previousStackIndex = state.list.findIndex(s => s.newsIdList.includes(newsId));
  if (previousStackIndex >= 0) {
    const previousStack = state.list[previousStackIndex];
    previousStack.newsIdList.splice(previousStack.newsIdList.indexOf(newsId), 1);
    newList = [
      ...newList.slice(0, previousStackIndex),
      previousStack,
      ...newList.slice(previousStackIndex + 1),
    ];
  }

  stack.newsIdList.push(newsId);
  return {
    ...state,
    list: newList,
  };
};

export default addNewsToStack;
