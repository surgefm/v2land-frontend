import { EventsState, EventAction } from '@Interfaces';

const addStackToEventOffshelfStackList = (state: EventsState, action: EventAction) => {
  if (!action.stackId || !action.eventId) return state;
  const { eventId, stackId } = action;
  const index = state.idIndexMap[eventId];
  if (typeof index === 'undefined') return state;
  const event = { ...state.list[index] };
  if (event.offshelfStackIdList.includes(stackId)) return state;
  event.offshelfStackIdList = [stackId, ...event.offshelfStackIdList];
  if (event.stackIdList.includes(stackId)) {
    event.stackIdList.splice(event.stackIdList.indexOf(stackId), 1);
  }

  return {
    ...state,
    list: [...state.list.slice(0, index), { ...event }, ...state.list.slice(index + 1)],
  };
};

export default addStackToEventOffshelfStackList;
