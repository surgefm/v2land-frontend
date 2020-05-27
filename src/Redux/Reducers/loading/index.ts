// #region Local Imports
import { ActionConsts } from '@Definitions';
// #endregion Local Imports

// #region Interface Imports
import { LoadingAction, LoadingState } from '@Interfaces';
// #endregion Interface Imports

const getInitialState = () => ({} as LoadingState);

export const LoadingReducer = (state = getInitialState(), action: LoadingAction) => {
  switch (action.type) {
    case ActionConsts.App.ResetReducer:
      return getInitialState();
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
