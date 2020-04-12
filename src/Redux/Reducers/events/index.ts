// #region Local Imports
import { ActionConsts } from '@Definitions';
// #endregion Local Imports

// #region Interface Imports
import { EventAction, EventsState } from '@Interfaces';
// #endregion Interface Imports

const INITIAL_STATE: EventsState = {
  list: [],
  idIndexMap: {},
};

export const EventReducer = (state = INITIAL_STATE, action: EventAction) => {
  switch (action.type) {
    case ActionConsts.Event.AddEvent:
    case ActionConsts.Event.UpdateEvent: {
      if (!action.event) return state;
      const eventId = action.eventId || action.event.id;
      if (!eventId) return state;

      const newState = { ...state };
      const index = state.idIndexMap[eventId];
      if (index) {
        newState.list[index] = action.event;
        return newState;
      }
      newState.idIndexMap[eventId] = newState.list.length;
      newState.list.push(action.event);
      return newState;
    }
    default:
      return state;
  }
};
