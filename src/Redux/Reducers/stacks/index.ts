// #region Local Imports
import { ActionConsts } from '@Definitions';
// #endregion Local Imports

// #region Interface Imports
import { StackAction, StacksState } from '@Interfaces';
// #endregion Interface Imports

import addNewsToEvent from './addNewsToEvent';
import addNewsToEventOffshelfNewsList from './addNewsToEventOffshelfNewsList';
import addStack from './addStack';
import removeNewsFromStack from './removeNewsFromStack';
import removeNewsFromEvent from './removeNewsFromEvent';
import updateEventOffshelfStackListOrder from './updateEventOffshelfStackListOrder';
import updateEventStackListOrder from './updateEventStackListOrder';

const getInitialState = () =>
  ({
    list: [],
    idIndexMap: {},
  } as StacksState);

export const StackReducer = (state = getInitialState(), action: StackAction) => {
  switch (action.type) {
    case ActionConsts.App.ResetReducer:
      return getInitialState();
    case ActionConsts.Stack.AddStack:
    case ActionConsts.Stack.UpdateStack:
      return addStack(state, action);
    case ActionConsts.Event.AddNewsToEvent:
      return addNewsToEvent(state, action);
    case ActionConsts.Event.AddNewsToEventOffshelfNewsList:
      return addNewsToEventOffshelfNewsList(state, action);
    case ActionConsts.Stack.RemoveNewsFromStack:
      return removeNewsFromStack(state, action);
    case ActionConsts.Event.RemoveNewsFromEvent:
      return removeNewsFromEvent(state, action);
    case ActionConsts.Event.UpdateEventOffshelfStackListOrder:
      return updateEventOffshelfStackListOrder(state, action);
    case ActionConsts.Event.UpdateEventStackListOrder:
      return updateEventStackListOrder(state, action);
    default:
      return state;
  }
};
