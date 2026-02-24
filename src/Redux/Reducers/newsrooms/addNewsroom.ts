import { NewsroomsState, NewsroomAction } from '@Interfaces';

const defaultNewsroom = {
  clients: [],
  roles: {
    owners: [],
    managers: [],
    editors: [],
    viewers: [],
  },
  resourceLocks: {},
  agentStatus: null as string | null,
  agentRun: null as import('@Interfaces').AgentRunState | null,
};

const addNewsroom = (state: NewsroomsState, action: NewsroomAction) => {
  if (!action.newsroom) return state;
  const { newsroom } = action;
  newsroom.eventId = -Math.abs(newsroom.eventId);
  const index = state.idIndexMap[newsroom.eventId];
  if (typeof index !== 'undefined') {
    const newNewsroom = {
      ...defaultNewsroom,
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
  newState.list.push({ ...defaultNewsroom, ...newsroom });
  return newState;
};

export default addNewsroom;
