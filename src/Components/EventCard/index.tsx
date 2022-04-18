import React from 'react';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';

import { EventActions, ClientActions } from '@Actions';
import { getEvent, getEventOwner } from '@Selectors';
import { UtilService } from '@Services';
import { Card } from '@Components/Basic';
import { EventCardShimmer } from './Shimmer';
import { PlainEventCard } from './PlainEventCard';
import { ImageEventCard } from './ImageEventCard';
import { IEventCard } from './EventCard';

const EventCard: React.FunctionComponent<IEventCard.IProps> = ({
  eventId,
  forcePlain,
  styles,
  className = '',
}) => {
  const event = useSelector(getEvent(eventId));
  const owner = useSelector(getEventOwner(eventId));
  const dispatch = useDispatch();

  if (!event) {
    dispatch(EventActions.GetEvent(eventId));
  }

  if (event && event.ownerId && !owner) {
    dispatch(ClientActions.GetClient(event.ownerId));
  }

  if (!event || !owner) {
    return (
      <Card styles={{ padding: 0, ...styles }} className={className}>
        <EventCardShimmer />
      </Card>
    );
  }

  return (
    <Link href="/[username]/[eventName]" as={UtilService.getEventPath(event, owner)}>
      <a>
        <Card styles={{ padding: 0, overflow: 'hidden', ...styles }} className={className}>
          {event.headerImage && !forcePlain ? (
            <ImageEventCard event={event} />
          ) : (
            <PlainEventCard event={event} />
          )}
        </Card>
      </a>
    </Link>
  );
};

export { EventCard, EventCardShimmer };
