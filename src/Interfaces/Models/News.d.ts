import { Record } from './Record';

export interface Site {
  id: number;
  name: string;
  icon?: string;
  homepage?: string;
}

export interface News {
  id: number;
  title: string;
  abstract?: string;
  time: Date;
  source: string;
  url: string;
  status: 'pending' | 'admitted' | 'rejected' | 'removed';
  comment?: string;
  contribution?: Record[];
  site?: Site;
}
