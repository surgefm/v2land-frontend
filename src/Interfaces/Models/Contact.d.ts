import { Auth } from './Auth';
import { Client } from './Client';
import { Subscription } from './Subscription';

export interface Contact {
  profileId?: string;
  type: 'email' | 'twitter' | 'weibo' | 'telegram' | 'mobileApp';
  method:
    | 'twitter'
    | 'weibo'
    | 'twitterAt'
    | 'weiboAt'
    | 'email'
    | 'emailDailyReport'
    | 'mobileAppNotification';
  status: 'active' | 'inactive' | 'expired';
  unsubscribeId?: string;
  owner: number;
  ownedBy?: Client;
  subscriptionId: number;
  subscription?: Subscription;
  authId?: number;
  auth?: Auth;
}
