import { Event, Stack, News } from '@Interfaces';

declare namespace IShare {
  export interface IProps {
    message?: string;
    url?: string;
    event?: Event;
    eventId?: number;
    stack?: Stack;
    stackId?: number;
    news?: News;
    newsId?: number;
    type?: 'event' | 'stack' | 'news';
  }
}

export { IShare };
