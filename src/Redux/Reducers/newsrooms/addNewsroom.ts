import { NewsroomsState, NewsroomAction } from '@Interfaces';

const addNewsroom = (state: NewsroomsState, action: NewsroomAction) => {
  if (!action.newsroom) return state;
  const { newsroom } = action;
  newsroom.eventId = -Math.abs(newsroom.eventId);
  newsroom.roles = newsroom.roles || [];
  const index = state.idIndexMap[newsroom.eventId];
  if (typeof index !== 'undefined') {
    const newNewsroom = {
      ...state.list[index],
      ...newsroom,
    };
    return {
      ...state,
      list: [...state.list.slice(0, index), newNewsroom, ...state.list.slice(index + 1)],
    };
  }

  const newState = { ...state };
  newState.idIndexMap[newsroom.eventId] = newState.list.length;
  newState.list.push(newsroom);
  return newState;
};

export default addNewsroom;
