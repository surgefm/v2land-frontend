// #region Interface Imports
import { IHomePage, Event, Stack, News, Client, EventStackNews } from '@Interfaces';
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

export interface ClientsState {
  list: Client[];
  clientId: number;
  idIndexMap: { [index: number]: number };
}

export interface EventStackNewsState {
  list: EventStackNews[];
}

export type LoadingState = { [index: string]: boolean };

export interface IStore {
  home: IHomePage.IStateProps;
  events: EventState;
  stacks: StacksState;
  news: NewsState;
  clients: ClientsState;
  esns: EventStackNewsState;
  loading: LoadingState;
}
