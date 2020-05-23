import { NewsroomsState, NewsroomAction, Newsroom } from '@Interfaces';

const removeNewsroomClient = (state: NewsroomsState, action: NewsroomAction) => {
  if (!action.eventId) return state;
  const eventId = -Math.abs(action.eventId);
  const index = state.idIndexMap[eventId];
  if (typeof index === 'undefined') return state;
  const clientId = action.clientId || (action.client || {}).id;
  const newsroom = { ...state.list[index] } as Newsroom;
  newsroom.clients = newsroom.clients.filter(c => c.id !== clientId);
  return {
    ...state,
    list: [...state.list.slice(0, index), newsroom, ...state.list.slice(index + 1)],
  };
};

export default removeNewsroomClient;
