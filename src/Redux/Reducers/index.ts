// #region Global Imports
import { combineReducers } from 'redux';
// #endregion Global Imports

// #region Local Imports
import { ClientReducer } from './clients';
import { EventReducer } from './events';
import { LoadingReducer } from './loading';
import { NewsReducer } from './news';
import { NewsroomReducer } from './newsrooms';
import { StackReducer } from './stacks';
// #endregion Local Imports

export default combineReducers({
  clients: ClientReducer,
  events: EventReducer,
  loading: LoadingReducer,
  news: NewsReducer,
  newsrooms: NewsroomReducer,
  stacks: StackReducer,
});
