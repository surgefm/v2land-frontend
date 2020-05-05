// #region Interface Imports
import { IHomePage, Event, Stack, News } from '@Interfaces';
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

export type LoadingState = { [index: string]: boolean };

export interface IStore {
  home: IHomePage.IStateProps;
  events: EventState;
  stacks: StacksState;
  news: NewsState;
  loading: LoadingState;
}
