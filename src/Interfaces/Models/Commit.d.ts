import { Client } from './Client';
import { Event } from './Event';

export interface Commit {
  id: number;
  summary: string;
  description?: string;
  data: Event;
  isForkCommit: boolean;
  diff: any;
  time: Date;
  parentId?: number;
  parent?: Commit;
  authorId: number;
  author: Client;
  eventId: number;
  event: Event;
}
