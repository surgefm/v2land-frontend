// #region Local Imports
import { ActionConsts } from '@Definitions';
// #endregion Local Imports

// #region Interface Imports
import { EventAction, StackAction, TagAction, EventsState } from '@Interfaces';
// #endregion Interface Imports

import addEvent from './addEvent';
import addEventToTag from './addEventToTag';
import addNewsToEvent from './addNewsToEvent';
import addNewsToEventOffshelfNewsList from './addNewsToEventOffshelfNewsList';
import addNewsToStack from './addNewsToStack';
import addStackToEvent from './addStackToEvent';
import addStackToEventOffshelfStackList from './addStackToEventOffshelfStackList';
import removeEventFromTag from './removeEventFromTag';
import removeNewsFromEvent from './removeNewsFromEvent';
import removeNewsFromStack from './removeNewsFromStack';
import updateEventOffshelfStackListOrder from './updateEventOffshelfStackListOrder';
import updateEventStackListOrder from './updateEventStackListOrder';

export const getEventInitialState = () =>
  ({
    list: [],
    idIndexMap: {},
    nameIdMap: {},
  } as EventsState);

export const EventReducer = (
  state = getEventInitialState(),
  action: EventAction | StackAction | TagAction
) => {
  switch (action.type) {
    case ActionConsts.App.ResetReducer:
      return getEventInitialState();
    case ActionConsts.Event.AddEvent:
    case ActionConsts.Event.UpdateEvent:
      return addEvent(state, action);
    case ActionConsts.Tag.AddEventToTag:
      return addEventToTag(state, action);
    case ActionConsts.Event.AddStackToEvent:
      return addStackToEvent(state, action);
    case ActionConsts.Event.AddStackToEventOffshelfStackList:
      return addStackToEventOffshelfStackList(state, action);
    case ActionConsts.Event.AddNewsToEvent:
      return addNewsToEvent(state, action);
    case ActionConsts.Stack.AddNewsToStack:
      return addNewsToStack(state, action);
    case ActionConsts.Event.AddNewsToEventOffshelfNewsList:
      return addNewsToEventOffshelfNewsList(state, action);
    case ActionConsts.Tag.RemoveEventFromTag:
      return removeEventFromTag(state, action);
    case ActionConsts.Event.RemoveNewsFromEvent:
      return removeNewsFromEvent(state, action);
    case ActionConsts.Stack.RemoveNewsFromStack:
      return removeNewsFromStack(state, action);
    case ActionConsts.Event.UpdateEventOffshelfStackListOrder:
      return updateEventOffshelfStackListOrder(state, action);
    case ActionConsts.Event.UpdateEventStackListOrder:
      return updateEventStackListOrder(state, action);
    default:
      return state;
  }
};
