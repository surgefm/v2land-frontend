// #region Local Imports
import { ActionConsts } from '@Definitions';
// #endregion Local Imports

export const LoadingActions = {
  BeginLoading: (identifier: string) => ({
    identifier,
    type: ActionConsts.Loading.BeginLoading,
  }),

  FinishLoading: (identifier: string) => ({
    identifier,
    type: ActionConsts.Loading.FinishLoading,
  }),
};
