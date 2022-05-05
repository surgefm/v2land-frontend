import { Client } from './Client';
import { Chat } from './Chat';

export interface ChatMember {
  id: string;
  chatId?: string;
  chat?: Chat;
  clientId: number;
  client?: Client;
}
