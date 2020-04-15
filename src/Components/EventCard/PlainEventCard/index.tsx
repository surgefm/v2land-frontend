import React from 'react';

import { EventCardTitle } from '../Title';
import { EventCardDescription } from '../Description';
import { IPlainEventCard } from './PlainEventCard';

export const PlainEventCard: React.FunctionComponent<IPlainEventCard.IProps> = ({ event }) => {
  return (
    <div className="event-container">
      <EventCardTitle>{event.name}</EventCardTitle>
      <EventCardDescription>{event.description}</EventCardDescription>
      <style jsx>
        {`
          .event-container {
            display: flex;
            flex-direction: column;
            width: 100%;
            padding: 1.5rem;
            position: relative;
            overflow: hidden;
          }
        `}
      </style>
    </div>
  );
};
