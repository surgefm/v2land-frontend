import rfdc from 'rfdc';
import { NewsroomsState, NewsroomAction } from '@Interfaces';
import { ClientRoleConsts } from '@Definitions';

const clone = rfdc();

const setNewsroomClientRole = (state: NewsroomsState, action: NewsroomAction) => {
  if (!action.eventId || !action.clientId) return state;
  const eventId = -Math.abs(action.eventId);
  const index = state.idIndexMap[eventId];
  if (typeof index === 'undefined') return state;
  const newsroom = clone(state.list[index]);
  const role = `${action.role}s`;

  const roles = ClientRoleConsts.filter(r => r !== action.role);
  for (let i = 0; i < roles.length; i += 1) {
    const r = `${roles[i]}s`;
    newsroom.roles[r] = newsroom.roles[r].filter(id => id !== action.clientId);
  }
  if (action.role && typeof newsroom.roles[role] !== 'undefined') {
    if (!newsroom.roles[role].includes(action.clientId)) {
      newsroom.roles[role].push(action.clientId);
    }
  }

  return {
    ...state,
    list: [...state.list.slice(0, index), newsroom, ...state.list.slice(index + 1)],
  };
};

export default setNewsroomClientRole;
