import { Event } from './Event';
import { Client } from './Client';

export interface Tag {
  id: number;
  name: string;
  description?: string;
  curators?: Client[];
  curatorIdList?: number[];
  status: 'visible' | 'hidden';
  events?: Event[];
  eventIdList: number[];
  parents?: Tag[];
  children?: Tag[];
  hierarchyPath: number[];
}
