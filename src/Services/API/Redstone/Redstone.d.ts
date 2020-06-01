import { HttpModel, Event, Client } from '@Interfaces';

declare namespace RedstoneModel {
  export interface GetEventListResponse {
    eventList: Event[];
  }

  export interface ClientLogInResponse {
    message: string;
    client: Client;
  }

  export interface UpdateClientOptions extends HttpModel.IRequestPayload {
    nickname?: string;
    description?: string;
    avatar?: string;
  }

  export interface UpdateClientResponse {
    message: string;
    client: Client;
  }

  export interface UpdateNewsOptions extends HttpModel.IRequestPayload {
    title?: string;
    source?: string;
    abstract?: string;
    time?: Date;
    comment?: string;
    status?: string;
    url?: string;
  }

  export interface UpdateNewsResponse {
    message: string;
    news: News;
  }

  export interface CreateNewsOptions extends HttpModel.IRequestPayload {
    title: string;
    source: string;
    abstract: string;
    time: Date;
    comment?: string;
    status?: string;
    url: string;
  }

  export interface CreateNewsResponse extends UpdateNewsResponse {}
}

export { RedstoneModel };
