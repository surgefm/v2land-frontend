export interface Record {
  model: string;
  operation: string;
  action: string;
  data?: any;
  before?: any;
  owner: number;
  ownedBy?: Client;
  target: number;
  subtarget?: number;
}
