import { Auth } from './Auth';
import { Record } from './Record';

export interface Client {
  id: number;
  username: string;
  role: string;
  email?: string;
  emailVerified?: boolean;
  settings?: any;
  auths?: Auth[];
  records?: Record[];
}
