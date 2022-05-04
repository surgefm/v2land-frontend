import { Client } from './Client';

export interface ChatMessage {
  id: string;
  text: string;
  chatId: string;
  authorId: number;
  author?: Client;
  createdAt: string;
}
