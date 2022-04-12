// #region Global Imports
import { createStore, applyMiddleware, Store } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { enableBatching } from 'redux-batched-actions';
import { createWrapper, Context, HYDRATE } from 'next-redux-wrapper';
// eslint-disable-next-line import/no-extraneous-dependencies
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
// #endregion Global Imports

// #region Local Imports
import { IStore, Action, HydrationAction } from '@Interfaces';
import Reducers, { getInitialState } from './Reducers';
// #endregion Local Imports

const reducer = (state: IStore = getInitialState(), action: Action) => {
  if (action.type === HYDRATE) {
    const nextState = {
      ...state, // use previous state
      ...(action as HydrationAction).payload, // apply delta from hydration
    };
    return nextState;
  }
  return enableBatching(Reducers)(state, action);
};

export const makeStore = (context: Context) => {
  return createStore(
    reducer,
    getInitialState(),
    composeWithDevTools(applyMiddleware(thunkMiddleware))
  );
};

export const storeWrapper = createWrapper<Store<IStore>>(makeStore);
