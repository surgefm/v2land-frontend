// #region Local Imports
import { ActionConsts } from '@Definitions';
// #endregion Local Imports

// #region Interface Imports
import { HomepageAction, HomepageState } from '@Interfaces';
// #endregion Interface Imports

export const getHomepageInitialState = () =>
  ({
    eventList: [],
  } as HomepageState);

export const HomepageReducer = (state = getHomepageInitialState(), action: HomepageAction) => {
  switch (action.type) {
    case ActionConsts.App.ResetReducer:
      return getHomepageInitialState();
    case ActionConsts.Homepage.SetEventList:
      if (!action.eventList) return state;
      return {
        eventList: [...state.eventList.slice(0, action.page || 1), action.eventList],
      };
    default:
      return state;
  }
};
