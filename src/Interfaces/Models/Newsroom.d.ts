export interface NewsroomClient {
  id: number;
  role: string;
}

export interface Newsroom {
  eventId: number;
  clients: NewsroomClient[];
  resourceLocks: { [index: string]: number };
}
