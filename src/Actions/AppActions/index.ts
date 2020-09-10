// #region Local Imports
import { ActionConsts } from '@Definitions';
// #endregion Local Imports

export const AppActions = {
  Map: (payload: {}) => ({
    payload,
    type: ActionConsts.App.SetReducer,
  }),

  Reset: () => ({
    type: ActionConsts.App.ResetReducer,
  }),
};
