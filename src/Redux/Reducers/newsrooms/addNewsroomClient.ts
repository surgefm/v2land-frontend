import deepClone from 'lodash/cloneDeep';
import { NewsroomsState, NewsroomAction, Newsroom } from '@Interfaces';

const addNewsroomClient = (state: NewsroomsState, action: NewsroomAction) => {
  if (!action.eventId || !action.client) return state;
  const eventId = -Math.abs(action.eventId);
  const index = state.idIndexMap[eventId];
  if (typeof index === 'undefined') return state;
  const { client } = action;
  const newsroom = deepClone(state.list[index]) as Newsroom;
  let found = false;
  for (let i = 0; i < newsroom.clients.length; i += 1) {
    if (newsroom.clients[i].id === client.id) {
      newsroom.clients[i] = {
        ...newsroom.clients[i],
        ...client,
      };
      found = true;
      break;
    }
  }

  if (!found) newsroom.clients.push(client);
  return {
    ...state,
    list: [...state.list.slice(0, index), newsroom, ...state.list.slice(index + 1)],
  };
};

export default addNewsroomClient;
