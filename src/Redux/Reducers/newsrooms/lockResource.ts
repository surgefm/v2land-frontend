import rfdc from 'rfdc';
import { NewsroomsState, NewsroomAction } from '@Interfaces';

const clone = rfdc();

const lockResource = (state: NewsroomsState, action: NewsroomAction) => {
  if (!action.model || !action.resourceId || !action.eventId) return state;
  const eventId = -Math.abs(action.eventId);
  const index = state.idIndexMap[eventId];
  if (typeof index === 'undefined') return state;

  const event = clone(state.list[index]);
  event.resourceLocks[`${action.model}-${action.resourceId}`] = action.locker || -1;
  return {
    ...state,
    list: [...state.list.slice(0, index), event, ...state.list.slice(index + 1)],
  };
};

export default lockResource;
