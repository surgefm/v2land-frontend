import { ClientAction, ClientsState } from '@Interfaces';

const setLoggedInClient = (state: ClientsState, action: ClientAction) => {
  if (!action.clientId) return state;
  return {
    ...state,
    clientId: action.clientId,
  };
};

export default setLoggedInClient;
