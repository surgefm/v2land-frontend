import rfdc from 'rfdc';
import { NewsroomsState, NewsroomAction } from '@Interfaces';

const clone = rfdc();

const addNewsroomClient = (state: NewsroomsState, action: NewsroomAction) => {
  if (!action.eventId || !action.clientId) return state;
  const eventId = -Math.abs(action.eventId);
  const index = state.idIndexMap[eventId];
  if (typeof index === 'undefined') return state;
  const { clientId } = action;
  const clientIndex = state.list[index].clients.indexOf(clientId);
  if (clientIndex >= 0) return state;

  const newsroom = clone(state.list[index]);
  newsroom.clients.push(clientId);
  return {
    ...state,
    list: [...state.list.slice(0, index), newsroom, ...state.list.slice(index + 1)],
  };
};

export default addNewsroomClient;
