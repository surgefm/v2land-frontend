// #region Global Imports
import { combineReducers } from 'redux';
// #endregion Global Imports

// #region Local Imports
import { EventReducer } from './events';
import { EventStackNewsReducer } from './eventStackNews';
import { NewsReducer } from './news';
import { StackReducer } from './stacks';
// #endregion Local Imports

export default combineReducers({
  events: EventReducer,
  esns: EventStackNewsReducer,
  news: NewsReducer,
  stacks: StackReducer,
});
