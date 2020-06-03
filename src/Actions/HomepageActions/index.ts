// #region Local Imports
import { ActionConsts } from '@Definitions';
// #endregion Local Imports

export const HomepageActions = {
  SetEventList: (eventList: number[]) => ({
    eventList,
    type: ActionConsts.Homepage.SetEventList,
  }),
};
