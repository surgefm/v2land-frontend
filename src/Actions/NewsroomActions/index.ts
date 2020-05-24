// #region Local Imports
import { Newsroom, NewsroomClient } from '@Interfaces';
import { ActionConsts } from '@Definitions';
// #endregion Local Imports

export const NewsroomActions = {
  AddNewsroom: (newsroom: Newsroom) => ({
    newsroom,
    type: ActionConsts.Newsroom.AddNewsroom,
  }),

  UpdateNewsroom: (newsroom: Newsroom) => ({
    newsroom,
    type: ActionConsts.Newsroom.UpdateNewsroom,
  }),

  AddNewsroomClient: (eventId: number, client: NewsroomClient) => ({
    eventId,
    client,
    type: ActionConsts.Newsroom.AddNewsroomClient,
  }),

  RemoveNewsroomClient: (eventId: number, client: NewsroomClient | number) => ({
    eventId,
    client: typeof client === 'number' ? undefined : client,
    clientId: typeof client === 'number' ? client : undefined,
    type: ActionConsts.Newsroom.RemoveNewsroomClient,
  }),

  SetPanelsOrder: (panels: string[]) => ({
    panels,
    type: ActionConsts.Newsroom.SetPanelsOrder,
  }),

  SetStackNewsVisible: (visible: boolean) => ({
    visible,
    type: ActionConsts.Newsroom.SetStackNewsVisible,
  }),
};
