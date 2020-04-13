// #region Global Imports
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { enableBatching } from 'redux-batched-actions';
// eslint-disable-next-line import/no-extraneous-dependencies
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
// #endregion Global Imports

// #region Local Imports
import Reducers from './Reducers';
// #endregion Local Imports

export const makeStore = (initialState: {}) => {
  return createStore(
    enableBatching(Reducers),
    initialState,
    composeWithDevTools(applyMiddleware(thunkMiddleware))
  );
};
