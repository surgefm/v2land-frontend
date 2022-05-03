import { Dispatch } from 'redux';

// #region Local Imports
import { ActionConsts } from '@Definitions';
import { Action, Client, IThunkStore } from '@Interfaces';
import { isLoading, isLoggedIn } from '@Selectors';
import { LoadingActions, TagActions } from '@Actions';
import { RedstoneService, getState } from '@Services';
import { batchActions } from 'redux-batched-actions';
import { EventActions } from '../EventActions';
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

const Logout = () => async (dispatch: Dispatch, store: IThunkStore) => {
  const state = getState(store);
  if (!isLoggedIn(state)) return;
  const identifier = 'client_is-logging-out';
  if (isLoading(identifier)(state)) return;
  dispatch(LoadingActions.BeginLoading(identifier));
  try {
    await RedstoneService.logout();
    dispatch(SetLoggedInClient(-1));
  } finally {
    dispatch(LoadingActions.FinishLoading(identifier));
  }
};

const GetClient = (clientId: number | string) => async (dispatch: Dispatch, store: IThunkStore) => {
  const identifier = `client-${clientId}`;
  if (isLoading(identifier)(getState(store))) return;
  dispatch(LoadingActions.BeginLoading(identifier));
  try {
    const { client } = await RedstoneService.getClient(clientId);
    const events = client.events || [];
    const actions: Action[] = [];

    actions.push(AddClient(client));

    for (let i = 0; i < events.length; i += 1) {
      const event = events[i];
      const tags = event.tags || [];
      actions.push(EventActions.AddEvent(event));
      for (let j = 0; j < tags.length; j += 1) {
        const tag = tags[j];
        actions.push(TagActions.AddTag(tag));
        actions.push(TagActions.AddEventToTag(tag.id, event.id));
      }
    }
    dispatch(batchActions(actions));
  } catch (err) {
    // Do nothing
  } finally {
    dispatch(LoadingActions.FinishLoading(identifier));
  }
};

export const ClientActions = {
  AddClient,
  UpdateClient,
  SetLoggedInClient,
  Logout,
  GetClient,
};
