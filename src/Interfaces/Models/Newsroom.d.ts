type StringDict = { [index: string]: number[] };

export interface NewsroomRoles extends StringDict {
  owners: number[];
  managers: number[];
  editors: number[];
  viewers: number[];
}

export interface Newsroom {
  eventId: number;
  clients: number[];
  roles: NewsroomRoles;
  resourceLocks: { [index: string]: number };
  socketStatus: 'connected' | 'disconnected';
}
