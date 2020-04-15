import React from 'react';
import { EventCard } from '@Components/EventCard';

export const EventCardList: React.FunctionComponent = () => {
  return (
    <div>
      <EventCard eventId={12} />
      <EventCard eventId={2} />
      <EventCard eventId={98} />
    </div>
  );
};
