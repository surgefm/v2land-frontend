// #region Global Imports
import { createStore, applyMiddleware, Store } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { enableBatching } from 'redux-batched-actions';
import { createWrapper, HYDRATE } from 'next-redux-wrapper';
// eslint-disable-next-line import/no-extraneous-dependencies
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
// #endregion Global Imports

// #region Local Imports
import { IStore, Action, HydrationAction } from '@Interfaces';
import Reducers, { getInitialState } from './Reducers';
// #endregion Local Imports

const batchedReducer = enableBatching(Reducers);

const reducer = (state: IStore = getInitialState(), action: Action) => {
  if (action.type === HYDRATE) {
    const payload = (action as HydrationAction).payload;
    return {
      ...state,
      ...payload,
      newsrooms: {
        ...payload.newsrooms,
        activeNewsroom: state.newsrooms.activeNewsroom || payload.newsrooms.activeNewsroom,
      },
    };
  }
  return batchedReducer(state, action);
};

export const makeStore = () => {
  return createStore(
    reducer,
    getInitialState(),
    composeWithDevTools(applyMiddleware(thunkMiddleware))
  );
};

export const storeWrapper = createWrapper<Store<IStore>>(makeStore);
