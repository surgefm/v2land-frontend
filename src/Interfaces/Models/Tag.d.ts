import { Event } from './Event';

export interface Tag {
  name: string;
  description?: string;
  status: 'visible' | 'hidden';
  events?: Event[];
}
