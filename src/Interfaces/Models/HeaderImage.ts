import { Event } from './Event';

export interface HeaderImage {
  imageUrl: string;
  sourceUrl?: string;
  source?: string;
  eventId: number;
  event?: Event;
}
