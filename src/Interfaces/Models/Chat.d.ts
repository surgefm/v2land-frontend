import { ChatMember } from './ChatMember';
import { Client } from './Client';
import { Event } from './Event';

export interface Chat {
  id: string;
  members?: ChatMember[];
  eventId?: number;
}

export interface PopularChatroom extends Chat {
  event: Event;
  eventOwner: Client;
}
