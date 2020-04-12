import { Record } from './Record';
import { Stack } from './Stack';
import { HeaderImage } from './HeaderImage';
import { Tag } from './Tag';

interface StringIndexInterface {
  [index: string]: any;
}

export interface SimplifiedEvent extends StringIndexInterface {
  id?: number;
  headerImage?: number | { id?: number } | HeaderImage;
  contribution?: Record[];
}

export interface Event extends SimplifiedEvent {
  name: string;
  description?: string;
  status?: string;
  stacks: Stack[];
  tags?: Tag[];
  newsCount?: number;
  stackCount?: number;
  temporaryStack?: News[];
  lastUpdate?: Date;
}
