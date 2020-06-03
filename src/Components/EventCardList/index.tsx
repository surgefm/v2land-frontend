import React from 'react';
import { useSelector } from 'react-redux';

import { getHomepageEventList } from '@Selectors';
import { UtilService } from '@Services';

import { SectionHeader } from '@Components/Basic';
import { EventCard } from '@Components/EventCard';
import { IEventCardList } from './EventCardList';

export const EventCardList: React.FunctionComponent<IEventCardList.IProps> = ({ className }) => {
  const eventList = useSelector(getHomepageEventList);
  const cards: React.ReactElement[] = [];
  let lastLapseStr = '';

  for (let i = 0; i < eventList.length; i += 1) {
    const event = eventList[i];
    if (event) {
      const lapseStr = UtilService.getTimeLapseString(event.commitTime, 'general');
      if (!lastLapseStr || lastLapseStr !== lapseStr) {
        lastLapseStr = lapseStr;
        cards.push(<SectionHeader key={`section-${lapseStr}`}>{lapseStr}更新</SectionHeader>);
      }
      cards.push(<EventCard key={`event-${event.id}`} eventId={event.id} />);
    }
  }

  return (
    <div className={className}>
      {cards}
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
