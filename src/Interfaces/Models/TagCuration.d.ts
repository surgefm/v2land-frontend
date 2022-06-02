export interface TagCuration {
  tagId: number;
  curatorId: number;
  comment?: string;
  state: 'certified' | 'warning' | 'need improvement';
  eventId: number;
  commitId?: number;
}
