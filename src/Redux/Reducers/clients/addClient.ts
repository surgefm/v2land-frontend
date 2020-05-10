import { ClientAction, ClientsState } from '@Interfaces';

const addClient = (state: ClientsState, action: ClientAction) => {
  if (!action.client) return state;
  const { client } = action;
  const newState = { ...state };
  if (typeof state.idIndexMap[client.id] === 'undefined') {
    newState.idIndexMap[client.id] = state.list.length;
  }
  newState.list[newState.idIndexMap[client.id]] = {
    ...newState.list[newState.idIndexMap[client.id]],
    ...client,
  };
  return newState;
};

export default addClient;
