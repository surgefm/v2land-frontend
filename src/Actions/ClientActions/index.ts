// #region Local Imports
import { ActionConsts } from '@Definitions';
import { Client } from '@Interfaces';
// #endregion Local Imports

export const ClientActions = {
  AddClient: (client: Client) => ({
    client,
    type: ActionConsts.Client.AddClient,
  }),

  UpdateClient: (clientId: number, client: Client) => ({
    clientId,
    client,
    type: ActionConsts.Client.UpdateClient,
  }),
};
