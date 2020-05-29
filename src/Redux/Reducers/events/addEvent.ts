import rfdc from 'rfdc';
import { EventsState, EventAction } from '@Interfaces';

const clone = rfdc();

const addEvent = (state: EventsState, action: EventAction) => {
  if (!action.event) return state;
  let event = { ...action.event };
  const eventId = action.eventId || event.id;
  if (!eventId) return state;
  event = { ...state.list[state.idIndexMap[eventId]], ...event };

  if (event.stacks) {
    event.stackIdList = event.stacks
      .filter(stack => (stack.order || -1) >= 0)
      .sort((a, b) => (b.order || 0) - (a.order || 0))
      .map(stack => Math.abs(stack.id) * (event.id > 0 ? 1 : -1));
    event.offshelfStackIdList = event.stacks
      .filter(stack => (stack.order || 0) < 0)
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .map(stack => Math.abs(stack.id) * (event.id > 0 ? 1 : -1));
  }
  event.stackIdList = event.stackIdList || [];
  event.newsIdList = event.newsIdList || [];
  event.offshelfNewsIdList = event.offshelfNewsIdList || [];
  event.offshelfStackIdList = event.offshelfStackIdList || [];

  if (action.event.offshelfStackIdList && !action.event.stackIdList) {
    event.stackIdList = event.stackIdList.filter(id => !event.offshelfStackIdList.includes(id));
  }

  if (action.event.stackIdList && !action.event.offshelfStackIdList) {
    event.offshelfStackIdList = event.offshelfStackIdList.filter(
      id => !event.stackIdList.includes(id)
    );
  }

  delete event.tags;
  delete event.stacks;
  delete event.temporaryStack;

  const newState = clone(state);
  const index = state.idIndexMap[eventId];

  const idName = `${Math.abs(eventId)}-${event.pinyin}`;
  newState.nameIdMap[`${event.name}@${event.ownerId}`] = eventId;
  newState.nameIdMap[`${idName}@${event.ownerId}`] = eventId;
  if (event.owner) {
    newState.nameIdMap[`${event.name}@${event.owner.username}`] = eventId;
    newState.nameIdMap[`${idName}@${event.owner.username}`] = eventId;
  }

  if (typeof index !== 'undefined') {
    newState.list[index] = event;
    return newState;
  }
  newState.idIndexMap[eventId] = newState.list.length;
  newState.list.push(event);
  return newState;
};

export default addEvent;
