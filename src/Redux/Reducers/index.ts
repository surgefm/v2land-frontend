// #region Global Imports
import { combineReducers } from 'redux';
import reduceReducers from 'reduce-reducers';
// #endregion Global Imports

// #region Local Imports
import { ActionConsts } from '@Definitions';
import { IStore, Action } from '@Interfaces';

import { ClientReducer } from './clients';
import { EventReducer } from './events';
import { LoadingReducer } from './loading';
import { NewsReducer } from './news';
import { NewsroomReducer } from './newsrooms';
import { StackReducer } from './stacks';

import addNewsToStack from './stacks/addNewsToStack';
// #endregion Local Imports

export default reduceReducers(
  combineReducers({
    clients: ClientReducer,
    events: EventReducer,
    loading: LoadingReducer,
    news: NewsReducer,
    newsrooms: NewsroomReducer,
    stacks: StackReducer,
  }),
  (state, action: Action) => {
    switch (action.type) {
      case ActionConsts.Stack.AddNewsToStack:
        return addNewsToStack((state as any) as IStore, action) as any;
      default:
        return state;
    }
  }
);
