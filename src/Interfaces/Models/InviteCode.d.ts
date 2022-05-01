import { Client } from './Client';

export interface InviteCode {
  id: string;
  code: string;
  ownerId: number;
  owner?: Client;
  userId: number;
  user?: Client;
}
