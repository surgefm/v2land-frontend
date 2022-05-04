import { ChatMember } from './ChatMember';

export interface Chat {
  id: string;
  members?: ChatMember[];
  eventId?: number;
}
