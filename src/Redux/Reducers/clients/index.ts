// #region Local Imports
import { ActionConsts } from '@Definitions';
// #endregion Local Imports

// #region Interface Imports
import { ClientAction, ClientsState } from '@Interfaces';
// #endregion Interface Imports

import addClient from './addClient';
import setLoggedInClient from './setLoggedInClient';

const getInitialState = () =>
  ({
    list: [],
    clientId: -1,
    idIndexMap: {},
  } as ClientsState);

export const ClientReducer = (state = getInitialState(), action: ClientAction) => {
  switch (action.type) {
    case ActionConsts.App.ResetReducer:
      return getInitialState();
    case ActionConsts.Client.AddClient:
    case ActionConsts.Client.UpdateClient:
      return addClient(state, action);
    case ActionConsts.Client.SetLoggedInClient:
      return setLoggedInClient(state, action);
    default:
      return state;
  }
};
