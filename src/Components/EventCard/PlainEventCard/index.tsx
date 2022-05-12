import React from 'react';

import { ClientAvatar } from '@Components/Client';
import { TagCurationBadge } from '@Components/Tag';

import { EventCardTitle } from '../Title';
import { EventCardDescription } from '../Description';
import { EventInfoList } from '../InfoList';
import { IPlainEventCard } from './PlainEventCard';

export const PlainEventCard: React.FunctionComponent<IPlainEventCard.IProps> = ({ event }) => {
  return (
    <div className="event-container">
      {event.ownerId ? (
        <div className="avatar">
          <ClientAvatar clientId={event.ownerId} asLink asA={false} />
        </div>
      ) : null}
      <EventCardTitle>
        {event.name}
        <TagCurationBadge curations={event.curations || []} onlyShowReviewed />
      </EventCardTitle>
      <EventCardDescription>{event.description}</EventCardDescription>
      <EventInfoList starCount={event.starCount || 0} tagIdList={event.tagIdList} />

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
            margin-left: 0.25rem;
          }

          @media (max-width: 600px) {
            .event-container {
              padding: 1rem;
            }
          }
        `}
      </style>
    </div>
  );
};
