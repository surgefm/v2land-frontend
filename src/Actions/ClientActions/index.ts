import { Dispatch } from 'redux';

// #region Local Imports
import { ActionConsts } from '@Definitions';
import { Client, IStore } from '@Interfaces';
import { isLoading } from '@Selectors';
import { LoadingActions } from '@Actions';
import { RedstoneService } from '@Services';
// #endregion Local Imports

const AddClient = (client: Client) => ({
  client,
  type: ActionConsts.Client.AddClient,
});

const UpdateClient = (clientId: number, client: Client) => ({
  clientId,
  client,
  type: ActionConsts.Client.UpdateClient,
});

const SetLoggedInClient = (clientId: number) => ({
  clientId,
  type: ActionConsts.Client.SetLoggedInClient,
});

const GetClient = (clientId: number) => async (dispatch: Dispatch, state: IStore) => {
  const identifier = `client-${clientId}`;
  if (isLoading(identifier)(state)) return;
  dispatch(LoadingActions.BeginLoading(identifier));
  const { client } = await RedstoneService.getClient(clientId);
  dispatch(AddClient(client));
  dispatch(LoadingActions.FinishLoading(identifier));
};

export const ClientActions = {
  AddClient,
  UpdateClient,
  SetLoggedInClient,
  GetClient,
};
