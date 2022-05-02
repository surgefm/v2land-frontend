import React from 'react';
import { useSelector } from 'react-redux';

import { getHomepageEventIdList, getHomepageEventList, getEventTimeList } from '@Selectors';
import { UtilService } from '@Services';
import { useTranslation } from '@I18n';

import { SectionHeader } from '@Components/Basic';
import { EventCard } from '@Components/EventCard';
import { IEventCardList } from './EventCardList';

const EventCardListImpl: React.FunctionComponent<IEventCardList.IProps> = ({ className }) => {
  const { t } = useTranslation('common');
  const eventIdList = useSelector(getHomepageEventIdList);
  const eventList = useSelector(getHomepageEventList);
  const eventTimeList = useSelector(getEventTimeList(eventIdList));
  const cards: React.ReactElement[] = [];
  let lastLapseStr = '';

  for (let i = 0; i < eventList.length; i += 1) {
    const event = eventList[i];
    const time = eventTimeList[i];
    if (event) {
      const lapseStr = time ? UtilService.getTimeLapseString(t, time, 'general') : lastLapseStr;
      if (!lastLapseStr || lastLapseStr !== lapseStr) {
        lastLapseStr = lapseStr;
        cards.push(<SectionHeader key={`section-${lapseStr}`}>{lapseStr}</SectionHeader>);
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

export const EventCardList = EventCardListImpl;
