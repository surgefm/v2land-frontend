// #region Local Imports
import { ActionConsts } from '@Definitions';
// #endregion Local Imports

export const HomepageActions = {
  SetEventList: (eventList: number[], page: number) => ({
    eventList,
    page,
    type: ActionConsts.Homepage.SetEventList,
  }),
};
