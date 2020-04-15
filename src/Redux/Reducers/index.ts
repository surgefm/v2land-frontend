// #region Global Imports
import { combineReducers } from 'redux';
// #endregion Global Imports

// #region Local Imports
import { EventReducer } from './events';
import { EventStackNewsReducer } from './eventStackNews';
import { LoadingReducer } from './loading';
import { NewsReducer } from './news';
import { StackReducer } from './stacks';
// #endregion Local Imports

export default combineReducers({
  events: EventReducer,
  esns: EventStackNewsReducer,
  loading: LoadingReducer,
  news: NewsReducer,
  stacks: StackReducer,
});
