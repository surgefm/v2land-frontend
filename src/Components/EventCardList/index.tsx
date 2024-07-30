import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { getHomepageEventIdList, getHomepageEventList, getEventTimeList } from '@Selectors';
import { UtilService } from '@Services';
import { useTranslation } from '@I18n';

import { EventActions } from '@Actions';
import { SectionHeader } from '@Components/Basic';
import { EventCard } from '@Components/EventCard';
import { IEventCardList } from './EventCardList';

const EventCardListImpl: React.FunctionComponent<IEventCardList.IProps> = ({ className }) => {
  const { t } = useTranslation('common');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
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

  useEffect(() => {
    setLoading(false);
  }, [eventIdList]);

  const loadMore = () => {
    if (loading) return;
    setLoading(true);
    dispatch(EventActions.GetEventList(page + 1));
    setPage(page + 1);
  };

  return (
    <div className={className}>
      {cards}
      <p style={{ textAlign: 'center' }}>
        <a
          onClick={loadMore}
          onKeyDown={e => e.key === 'Enter' && loadMore()}
          role="button"
          tabIndex={0}
        >
          {loading ? '正在加载' : '更多时间线'}
        </a>
      </p>
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
