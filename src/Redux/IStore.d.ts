// #region Interface Imports
import { IHomePage, Event, Stack, News, EventStackNews } from '@Interfaces';
// #endregion Interface Imports

export interface EventsState {
  list: Event[];
  idIndexMap: { [index: number]: number };
}

export interface StacksState {
  list: Stack[];
  idIndexMap: { [index: number]: number };
}

export interface NewsState {
  list: News[];
  idIndexMap: { [index: number]: number };
}

export interface EventStackNewsState {
  list: EventStackNews[];
}

export interface IStore {
  home: IHomePage.IStateProps;
  events: EventState;
  stacks: StackState;
  news: NewsState;
  esns: EventStackNewsState;
}
