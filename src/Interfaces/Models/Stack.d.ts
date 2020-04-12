import { Event } from './Event';
import { News } from './News';
import { Record } from './Record';

export interface Stack {
  id: number;
  title?: string;
  description?: string;
  newsCount?: number;
  status?: string;
  news?: News[];
  order?: number;
  time?: Date;
  contribution?: Record[];
  enableNotification?: boolean;
  eventId?: number;
  event?: Event;
}
