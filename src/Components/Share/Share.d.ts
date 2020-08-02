import { WithTranslation } from 'next-i18next';
import { Event, Stack, News } from '@Interfaces';

declare namespace IShare {
  export interface IProps extends WithTranslation {
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
