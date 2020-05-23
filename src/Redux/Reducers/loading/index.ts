// #region Local Imports
import { ActionConsts } from '@Definitions';
// #endregion Local Imports

// #region Interface Imports
import { LoadingAction, LoadingState } from '@Interfaces';
// #endregion Interface Imports

const INITIAL_STATE: LoadingState = {};

export const LoadingReducer = (state = INITIAL_STATE, action: LoadingAction) => {
  switch (action.type) {
    case ActionConsts.App.ResetReducer:
      return INITIAL_STATE;
    case ActionConsts.Loading.BeginLoading:
      return {
        ...state,
        [action.identifier]: true,
      };
    case ActionConsts.Loading.FinishLoading:
      return {
        ...state,
        [action.identifier]: false,
      };
    default:
      return state;
  }
};
