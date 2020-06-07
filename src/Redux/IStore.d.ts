// #region Interface Imports
import { Event, Stack, News, Client, Newsroom, Tag } from '@Interfaces';
// #endregion Interface Imports

export interface HomepageState {
  eventList: number[];
}

export interface EventsState {
  list: Event[];
  idIndexMap: { [index: number]: number };
  nameIdMap: { [index: string]: number };
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

export interface NewsroomsState {
  showStackNews: boolean;
  showClientInvitation: boolean;
  stackNewsVisibility: { [index: number]: boolean };
  panels: string[];
  activeNewsroom: number;
  list: Newsroom[];
  idIndexMap: { [index: number]: number };
}

export interface TagsState {
  list: Tag[];
  idIndexMap: { [index: number]: number };
  nameIdMap: { [index: string]: number };
}

export type LoadingState = { [index: string]: boolean };

export interface IStore {
  homepage: HomepageState;
  events: EventsState;
  stacks: StacksState;
  news: NewsState;
  clients: ClientsState;
  newsrooms: NewsroomsState;
  tags: TagsState;
  loading: LoadingState;
}

export type IThunkStore = IStore | (() => IStore);
