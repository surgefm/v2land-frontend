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
  eventId = 0,
  forcePlain,
  styles,
  event: e,
  owner: o,
  className = '',
}) => {
  const selectorEvent = useSelector(getEvent(e ? 0 : eventId));
  const selectorOwner = useSelector(getEventOwner(e ? 0 : eventId));
  const dispatch = useDispatch();
  const event = e || selectorEvent;
  const owner = o || selectorOwner;

  if (!event) {
    dispatch(EventActions.GetEvent(eventId));
  }

  if (event && event.ownerId && !owner) {
    dispatch(ClientActions.GetClient(event.ownerId));
  }

  if (!event) {
    return (
      <Card styles={{ padding: 0, ...styles }} className={className}>
        <EventCardShimmer />
      </Card>
    );
  }

  return (
    <Link href={UtilService.getEventPath(event, owner)} style={{ textDecoration: 'none', color: 'inherit' }}>
      <Card styles={{ padding: 0, overflow: 'hidden', ...styles }} className={className}>
        {event.headerImage && !forcePlain ? (
          <ImageEventCard event={event} />
        ) : (
          <PlainEventCard event={event} />
        )}
      </Card>
    </Link>
  );
};

export { EventCard, EventCardShimmer };
