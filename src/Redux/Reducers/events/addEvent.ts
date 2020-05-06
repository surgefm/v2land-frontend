import { EventsState, EventAction } from '@Interfaces';

const addEvent = (state: EventsState, action: EventAction) => {
  if (!action.event) return state;
  const event = { ...action.event };
  if (event.stacks) {
    event.stackIdList = event.stacks.map(stack => stack.id);
  }
  event.stackIdList = event.stackIdList || [];
  event.newsIdList = event.newsIdList || [];
  event.temporaryStackNewsIdList = event.temporaryStackNewsIdList || [];
  event.offshelfNewsIdList = event.offshelfNewsIdList || [];
  event.offshelfStackIdList = event.offshelfStackIdList || [];

  if (event.temporaryStack) {
    event.temporaryStackNewsIdList = event.temporaryStack.map(n => n.id);
    event.newsIdList = [...event.newsIdList, ...event.temporaryStackNewsIdList];
  }

  delete event.tags;
  delete event.stacks;
  delete event.temporaryStack;

  const eventId = action.eventId || event.id;
  if (!eventId) return state;

  const newState = { ...state };
  const index = state.idIndexMap[eventId];

  if (typeof index !== 'undefined') {
    newState.list[index] = event;
    return newState;
  }
  newState.idIndexMap[eventId] = newState.list.length;
  newState.list.push(event);
  return newState;
};

export default addEvent;
