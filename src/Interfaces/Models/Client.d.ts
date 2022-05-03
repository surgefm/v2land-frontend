import { Auth } from './Auth';
import { Record } from './Record';
import { Event } from './Event';
import { Star } from './Star';

export interface Client {
  id: number;
  username: string;
  nickname: string;
  description?: string;
  role: string;
  email?: string;
  emailVerified?: boolean;
  settings?: any;
  auths?: Auth[];
  records?: Record[];
  events?: Event[];
  avatar?: string;
  stars?: Star[];
}
