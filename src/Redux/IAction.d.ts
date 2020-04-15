// #region Global Imports
import { Action as ReduxAction } from 'redux';
// #endregion Global Imports

// #region Local Imports
import { Event, Stack, News } from '@Interfaces';
// #endregion Local Imports

export interface EventAction extends ReduxAction {
  event?: Event;
  eventId?: number;
  stackId?: number;
  newsId?: number;
  isInTemporaryStack?: boolean;
}

export interface StackAction extends ReduxAction {
  stack?: Stack;
  stackId?: number;
  newsId?: number;
}

export interface NewsAction extends ReduxAction {
  news: News;
  newsId?: number;
}

export type Action = EventAction | StackAction | NewsAction;

export interface IAction<T> extends ReduxAction {
  payload?: T;
}