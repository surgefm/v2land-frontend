// #region Local Imports
import { ActionConsts } from '@Definitions';
// #endregion Local Imports

// #region Interface Imports
import { EventAction, EventsState, StackAction } from '@Interfaces';
// #endregion Interface Imports

const INITIAL_STATE: EventsState = {
  list: [],
  idIndexMap: {},
};

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

const addStackToEvent = (state: EventsState, action: EventAction) => {
  if (!action.stackId || !action.eventId) return state;
  const { eventId, stackId } = action;
  const index = state.idIndexMap[eventId];
  if (typeof index === 'undefined') return state;
  const event = state.list[index];
  event.stackIdList = event.stackIdList || [];
  if (event.stackIdList.includes(stackId)) return state;
  event.stackIdList.push(stackId);

  return {
    ...state,
    list: [...state.list.slice(0, index), event, ...state.list.slice(index + 1)],
  };
};

const addNewsToEvent = (state: EventsState, action: EventAction) => {
  if (!action.newsId || !action.eventId) return state;
  const { eventId, newsId, isInTemporaryStack } = action;
  const index = state.idIndexMap[eventId];
  if (typeof index === 'undefined') return state;
  const event = state.list[index];
  event.temporaryStackNewsIdList = event.temporaryStackNewsIdList || [];
  event.newsIdList = event.newsIdList || [];
  if (isInTemporaryStack) {
    if (event.temporaryStackNewsIdList.includes(newsId)) return state;
    event.temporaryStackNewsIdList.push(newsId);
  }

  if (!event.newsIdList.includes(newsId)) {
    event.newsIdList.push(newsId);
  }

  return {
    ...state,
    list: [...state.list.slice(0, index), event, ...state.list.slice(index + 1)],
  };
};

const addNewsToStack = (state: EventsState, action: StackAction) => {
  const { stackId, newsId } = action;
  if (!stackId || !newsId) return state;
  const eventIndex = state.list.findIndex(e => (e.stackIdList || []).includes(stackId));
  if (typeof eventIndex === 'undefined') return state;
  const event = { ...state.list[eventIndex] };
  if (event.newsIdList.includes(newsId)) return state;
  event.newsIdList.push(newsId);

  return {
    ...state,
    list: [...state.list.slice(0, eventIndex), event, state.list.slice(eventIndex + 1)],
  };
};

export const EventReducer = (state = INITIAL_STATE, action: EventAction | StackAction) => {
  switch (action.type) {
    case ActionConsts.Event.AddEvent:
    case ActionConsts.Event.UpdateEvent:
      return addEvent(state, action);
    case ActionConsts.Event.AddStackToEvent:
      return addStackToEvent(state, action);
    case ActionConsts.Event.AddNewsToEvent:
      return addNewsToEvent(state, action);
    case ActionConsts.Stack.AddNewsToStack:
      return addNewsToStack(state, action);
    default:
      return state;
  }
};
