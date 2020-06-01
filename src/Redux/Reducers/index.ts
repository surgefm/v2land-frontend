// #region Global Imports
import { combineReducers, Reducer, AnyAction } from 'redux';
import reduceReducers from 'reduce-reducers';
// #endregion Global Imports

// #region Local Imports
import { ActionConsts } from '@Definitions';
import { IStore, Action } from '@Interfaces';

import { ClientReducer, getClientInitialState } from './clients';
import { EventReducer, getEventInitialState } from './events';
import { LoadingReducer, getLoadingInitialState } from './loading';
import { NewsReducer, getNewsInitialState } from './news';
import { NewsroomReducer, getNewsroomInitialState } from './newsrooms';
import { StackReducer, getStackInitialState } from './stacks';

import addNewsToStack from './stacks/addNewsToStack';
// #endregion Local Imports

export const getInitialState = (): IStore => ({
  clients: getClientInitialState(),
  events: getEventInitialState(),
  loading: getLoadingInitialState(),
  news: getNewsInitialState(),
  newsrooms: getNewsroomInitialState(),
  stacks: getStackInitialState(),
});

const reduced = combineReducers({
  clients: ClientReducer,
  events: EventReducer,
  loading: LoadingReducer,
  news: NewsReducer,
  newsrooms: NewsroomReducer,
  stacks: StackReducer,
}) as Reducer<IStore, Action>;

export default reduceReducers((state: IStore = getInitialState(), action?: AnyAction) => {
  if (!action) return state;
  switch (action.type) {
    case ActionConsts.Stack.AddNewsToStack:
      return addNewsToStack(state, action);
    default:
      return state;
  }
}, reduced) as Reducer<IStore, AnyAction>;
