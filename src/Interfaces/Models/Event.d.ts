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
  starCount?: number;
}

export interface Event extends SimplifiedEvent {
  name: string;
  description: string;
  status?: string;
  stacks?: Stack[];
  tags?: Tag[];
  tagIdList: number[];
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
  time?: Date;
  numUpvote?: number;
  contributors?: {
    commitId: number;
    contributorId: number;
    points: number;
  }[];
  updatedAt: string;
}
