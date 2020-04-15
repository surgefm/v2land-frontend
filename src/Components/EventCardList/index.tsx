import React from 'react';
import { SectionHeader } from '@Components/Basic';
import { EventCard } from '@Components/EventCard';

export const EventCardList: React.FunctionComponent = () => {
  return (
    <div>
      <SectionHeader>三天前更新</SectionHeader>
      <EventCard eventId={12} />
      <EventCard eventId={2} />
      <EventCard eventId={98} />
      <style jsx>
        {`
          div {
            width: 100%;
          }
        `}
      </style>
    </div>
  );
};
