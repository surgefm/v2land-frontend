import { StacksState, EventAction } from '@Interfaces';

const addNewsToEventOffshelfNewsList = (state: StacksState, action: EventAction) => {
  if (!action.newsId || !action.eventId) return state;
  const { newsId, eventId } = action;
  const index = state.list.findIndex(s => s.eventId === eventId && s.newsIdList.includes(newsId));
  if (index < 0) return state;

  const stack = state.list[index];
  stack.newsIdList.splice(stack.newsIdList.indexOf(newsId), 1);
  return {
    ...state,
    list: [...state.list.slice(0, index), stack, ...state.list.slice(index + 1)],
  };
};

export default addNewsToEventOffshelfNewsList;
