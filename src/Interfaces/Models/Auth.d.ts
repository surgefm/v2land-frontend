import { Client } from './Client';

export interface Auth {
  site: 'apple' | 'twitter' | 'weibo' | 'email';
  profileId?: string;
  profile?: any;
  owner: number;
  ownedBy?: Client;
}
