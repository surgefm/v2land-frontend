import { Event } from './Event';
import { Client } from './Client';
import { Contact } from './Contact';

export interface Subscription {
  mode: string;
  status: 'active' | 'unsubscribed';
  unsubscribeId: string;
  eventId: number;
  event?: Event;
  subscriber: number;
  subscribedBy?: Client;
  contacts?: Contact[];
}
