import { Client } from './Client';
import { Event } from './Event';

export interface Star {
  id: string;
  clientId: number;
  client?: Client;
  eventId: number;
  event?: Event;
}
