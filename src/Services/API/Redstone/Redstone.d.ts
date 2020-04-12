import { HttpModel, Event } from '@Interfaces';

declare namespace RedstoneModel {
  export interface GetEventListResponse {
    eventList: Event[];
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
