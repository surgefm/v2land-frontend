import rfdc from 'rfdc';
import { NewsroomsState, NewsroomAction } from '@Interfaces';

const clone = rfdc();

const setNewsroomSocketStatus = (state: NewsroomsState, action: NewsroomAction) => {
  if (!action.eventId || !action.status) return state;
  const eventId = -Math.abs(action.eventId);
  const index = state.idIndexMap[eventId];
  if (typeof index === 'undefined') return state;
  const newsroom = clone(state.list[index]);
  newsroom.socketStatus = action.status;

  return {
    ...state,
    list: [...state.list.slice(0, index), newsroom, ...state.list.slice(index + 1)],
  };
};

export default setNewsroomSocketStatus;
