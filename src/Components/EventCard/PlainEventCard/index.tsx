import React from 'react';

import { ClientAvatar } from '@Components/Client';
import { EventCardTitle } from '../Title';
import { EventCardDescription } from '../Description';
import { IPlainEventCard } from './PlainEventCard';

export const PlainEventCard: React.FunctionComponent<IPlainEventCard.IProps> = ({ event }) => {
  return (
    <div className="event-container">
      {event.ownerId ? (
        <div className="avatar">
          <ClientAvatar clientId={event.ownerId} asLink />
        </div>
      ) : null}
      <EventCardTitle>{event.name}</EventCardTitle>
      <EventCardDescription>{event.description}</EventCardDescription>

      <style jsx>
        {`
          .event-container {
            width: 100%;
            padding: 1.5rem;
            position: relative;
            overflow: hidden;
          }

          .avatar {
            float: right;
          }
        `}
      </style>
    </div>
  );
};
