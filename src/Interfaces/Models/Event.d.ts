import { Record } from './Record';
import { Stack } from './Stack';
import { HeaderImage } from './HeaderImage';
import { News } from './News';
import { Tag } from './Tag';

interface StringIndexInterface {
  [index: string]: any;
}

export interface SimplifiedEvent extends StringIndexInterface {
  id: number;
  headerImage?: HeaderImage;
  contribution?: Record[];
}

export interface Event extends SimplifiedEvent {
  name: string;
  description: string;
  status?: string;
  stacks?: Stack[];
  tags?: Tag[];
  newsIdList: number[];
  offshelfNewsIdList: number[];
  stackIdList: number[];
  offshelfStackIdList: number[];
  newsCount?: number;
  stackCount?: number;
  temporaryStack?: News[];
  temporaryStackNewsIdList: number[];
  lastUpdate?: Date;
  contributorIdList?: number[];
  commitTime?: Date;
  latestAdmittedNews?: News;
  ownerId: number;
}
