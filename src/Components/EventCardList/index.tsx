import React from 'react';
import { SectionHeader } from '@Components/Basic';
import { EventCard } from '@Components/EventCard';
import { IEventCardList } from './EventCardList';

export const EventCardList: React.FunctionComponent<IEventCardList.IProps> = ({ className }) => {
  return (
    <div className={className}>
      <SectionHeader>刚刚更新</SectionHeader>
      <EventCard eventId={12} />
      <SectionHeader>三天前更新</SectionHeader>
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
