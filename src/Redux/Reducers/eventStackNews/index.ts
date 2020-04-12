// #region Local Imports
import { ActionConsts } from '@Definitions';
// #endregion Local Imports

// #region Interface Imports
import { EventActions } from '@Actions';
import { EventAction, StackAction, EventStackNewsState } from '@Interfaces';
// #endregion Interface Imports

const INITIAL_STATE: EventStackNewsState = {
  list: [],
};

const addStackToEvent = (state: EventStackNewsState, action: EventAction) => {
  if (!action.stackId || !action.eventId) return state;
  const { eventId, stackId } = action;
  const index = state.list.findIndex(
    esn => esn.eventId === eventId && esn.stackId === stackId
  );
  if (index >= 0) return state;
  return {
    list: [...state.list, { eventId, stackId }],
  };
};

const addNewsToEvent = (state: EventStackNewsState, action: EventAction) => {
  if (!action.newsId || !action.eventId) return state;
  const { eventId, newsId, stackId, isInTemporaryStack } = action;
  const index = state.list.findIndex(
    esn => esn.eventId === eventId && esn.newsId === newsId
  );
  if (index >= 0) {
    const esn = state.list[index];
    if (
      !!isInTemporaryStack === !!esn.isInTemporaryStack &&
      (!stackId || esn.stackId === stackId)
    ) {
      return state;
    }
    return {
      list: [
        ...state.list.slice(0, index),
        { eventId, newsId, stackId, isInTemporaryStack },
        ...state.list.slice(index + 1),
      ],
    };
  }
  return {
    list: [...state.list, { eventId, newsId, stackId, isInTemporaryStack }],
  };
};

const addNewsToStack = (state: EventStackNewsState, action: StackAction) => {
  if (!action.newsId || !action.stackId) return state;
  const { stackId, newsId } = action;
  const index = state.list.findIndex(
    esn => esn.stackId === stackId && esn.newsId === newsId
  );
  if (index >= 0) return state;

  const esnIndex = state.list.findIndex(esn => esn.stackId === stackId);
  if (esnIndex < 0) return state;
  const esn = state.list[esnIndex];
  const newEsn = {
    eventId: esn.eventId,
    stackId,
    newsId,
  };
  if (esn.newsId) {
    return {
      list: [...state.list, newEsn],
    };
  }
  return {
    list: [
      ...state.list.slice(0, esnIndex),
      newEsn,
      ...state.list.slice(esnIndex + 1),
    ],
  };
};

const addStack = (state: EventStackNewsState, action: StackAction) => {
  if (!action.stack) return state;
  const { stack } = action;
  const { eventId, id: stackId } = stack;
  if (!eventId || !stackId) return state;
  let newState = addStackToEvent(
    state,
    EventActions.AddStackToEvent(eventId, stackId)
  );

  const newsList = stack.news || [];
  for (let i = 0; i < newsList.length; i += 1) {
    const news = newsList[i];
    newState = addNewsToEvent(
      newState,
      EventActions.AddNewsToEvent(eventId, news.id, stackId)
    );
  }

  return newState;
};

export const EventStackNewsReducer = (
  state = INITIAL_STATE,
  action: EventAction | StackAction
) => {
  switch (action.type) {
    case ActionConsts.Event.AddStackToEvent:
      return addStackToEvent(state, action);
    case ActionConsts.Event.AddNewsToEvent:
      return addNewsToEvent(state, action);
    case ActionConsts.Stack.AddNewsToStack:
      return addNewsToStack(state, action);
    case ActionConsts.Stack.AddStack:
      return addStack(state, action);
    default:
      return state;
  }
};
