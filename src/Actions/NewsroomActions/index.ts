// #region Local Imports
import { ActionConsts } from '@Definitions';
// #endregion Local Imports

export const NewsroomActions = {
  SetPanelsOrder: (panels: string[]) => ({
    panels,
    type: ActionConsts.Newsroom.SetPanelsOrder,
  }),
};
