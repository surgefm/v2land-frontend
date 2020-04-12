import { Record } from './Record';

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
}
