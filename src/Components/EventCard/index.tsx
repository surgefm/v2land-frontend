import React from 'react';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';

import { EventActions } from '@Actions';
import { getEvent, getEventOwner } from '@Selectors';
import { UtilService } from '@Services';
import { Card } from '@Components/Basic';
import { EventCardShimmer } from './Shimmer';
import { PlainEventCard } from './PlainEventCard';
import { ImageEventCard } from './ImageEventCard';
import { IEventCard } from './EventCard';

const EventCard: React.FunctionComponent<IEventCard.IProps> = ({ eventId }) => {
  const event = useSelector(getEvent(eventId));
  const owner = useSelector(getEventOwner(eventId));
  const dispatch = useDispatch();

  if (!event || !owner) {
    dispatch(EventActions.GetEvent(eventId));
    return (
      <Card styles={{ padding: 0 }}>
        <EventCardShimmer />
      </Card>
    );
  }

  return (
    <Link href="/[username]/[eventName]" as={UtilService.getEventPath(event, owner)}>
      <a>
        <Card styles={{ padding: 0 }}>
          {event.headerImage ? <ImageEventCard event={event} /> : <PlainEventCard event={event} />}
        </Card>
      </a>
    </Link>
  );
};

export { EventCard };
