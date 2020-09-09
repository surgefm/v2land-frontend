import { WithTranslation } from 'next-i18next';
import { Event, Stack, News, Tag } from '@Interfaces';

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
    tag?: Tag;
    tagId?: number;
    type?: 'event' | 'stack' | 'news' | 'tag';
  }
}

export { IShare };
