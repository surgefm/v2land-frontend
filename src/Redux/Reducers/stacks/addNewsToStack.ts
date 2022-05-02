import { IStore, StackAction } from '@Interfaces';
import { getNews } from '@Selectors';

const addNewsToStack = (store: IStore, action: StackAction) => {
  const { stackId, newsId } = action;
  if (!stackId || !newsId) return store;

  const state = store.stacks;
  const stackIndex = state.idIndexMap[stackId];
  if (typeof stackIndex === 'undefined') return store;
  const stack = { ...state.list[stackIndex] };
  stack.newsIdList = stack.newsIdList || [];
  if (stack.newsIdList.includes(newsId)) return store;
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
  stack.newsIdList.sort((a, b) => {
    const newsA = getNews(a)(store);
    const newsB = getNews(b)(store);
    if (!newsA) return 1;
    if (!newsB) return -1;
    return new Date(newsA.time).getTime() - new Date(newsB.time).getTime();
  });

  return {
    ...store,
    stacks: {
      ...state,
      list: newList,
    },
  };
};

export default addNewsToStack;
