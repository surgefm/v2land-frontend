// #region Global Imports
import { Action as ReduxAction } from 'redux';
import { ThunkDispatch as TDispatch } from 'redux-thunk';
// #endregion Global Imports

// #region Local Imports
import { Event, Stack, News, Client, Newsroom, NewsroomSocketStatus } from '@Interfaces';
import { IStore } from './IStore';
// #endregion Local Imports

export interface HomepageAction extends ReduxAction {
  eventList: number[];
}

export interface EventAction extends ReduxAction {
  event?: Event;
  eventId?: number;
  stackId?: number;
  stackIdList?: number[];
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

export interface NewsroomAction extends ReduxAction {
  panels?: string[];
  newsroom?: Newsroom;
  eventId?: number;
  clientId?: number;
  stackId?: number;
  visible?: boolean;
  model?: string;
  resourceId?: number;
  locker?: number;
  role?: string;
  status?: NewsroomSocketStatus;
}

export interface ClientAction extends ReduxAction {
  client?: Client;
  clientId?: number;
}

export interface LoadingAction extends ReduxAction {
  identifier: string;
}

export type Action = EventAction | StackAction | NewsAction | ClientAction | LoadingAction;

export interface IAction<T> extends ReduxAction {
  payload?: T;
}

export type ThunkDispatch = TDispatch<IStore, any, Action>;
