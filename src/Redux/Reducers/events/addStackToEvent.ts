import { EventsState, EventAction } from '@Interfaces';

const addStackToEvent = (state: EventsState, action: EventAction) => {
  if (!action.stackId || !action.eventId) return state;
  const { eventId, stackId } = action;
  const index = state.idIndexMap[eventId];
  if (typeof index === 'undefined') return state;
  const event = { ...state.list[index] };
  event.stackIdList = event.stackIdList || [];
  if (event.stackIdList.includes(stackId)) return state;
  event.stackIdList.push(stackId);
  if (event.offshelfStackIdList.includes(stackId)) {
    event.offshelfStackIdList.splice(event.offshelfStackIdList.indexOf(stackId), 1);
  }

  return {
    ...state,
    list: [...state.list.slice(0, index), event, ...state.list.slice(index + 1)],
  };
};

export default addStackToEvent;
