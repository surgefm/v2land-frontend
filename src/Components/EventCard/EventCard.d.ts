import { Event, Client } from '@Interfaces';

declare namespace IEventCard {
  export interface IProps {
    eventId?: number;
    forcePlain?: boolean;
    styles?: React.StyleHTMLAttributes;
    className?: string;
    event?: Event;
    owner?: Client;
  }
}

export { IEventCard };
