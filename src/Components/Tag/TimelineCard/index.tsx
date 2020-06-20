import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link';
import { Skeleton } from 'antd';

import { getEvent, getEventContributorIdList, getEventOwner } from '@Selectors';
import { UtilService } from '@Services';
import { EventContributorList, Card } from '@Components';
import { ThunkDispatch } from '@Interfaces';
import { EventActions } from '@Actions';

import { ITimelineCard } from './TimelineCard';
import styles from './TimelineCard.module.scss';

export const Timeline = () => {
  return <></>;
};

const TimelineCard: React.FunctionComponent<ITimelineCard.IProps> = ({ eventId }) => {
  const event = useSelector(getEvent(eventId));
  const contributors = useSelector(getEventContributorIdList(eventId));
  const eventOwner = useSelector(getEventOwner(eventId));
  const dispatch = useDispatch() as ThunkDispatch;

  if (!event) {
    dispatch(EventActions.GetEvent(eventId));
    return (
      <Card className={styles['timeline-card']}>
        <div className={styles['timeline-card-top']}>
          <Skeleton active />
        </div>
        <div className={styles['timeline-card-bottom']}>
          <Skeleton title={false} paragraph={{ rows: 2 }} active />
        </div>
      </Card>
    );
  }

  return (
    <Link href="/[username]/[eventName]" as={UtilService.getEventPath(event, eventOwner)}>
      <a>
        <Card className={styles['timeline-card']}>
          <div className={styles['timeline-card-top']}>
            <div className={styles.title}>
              {event.time && <p>{UtilService.getTimeLapseString(event.time, 'general')}更新</p>}
              <h2>{event.name}</h2>
            </div>

            {event.description && <p className={styles.description}>{event.description}</p>}

            <div className={styles.info}>
              {event.numUpvote && <p>赞 {event.numUpvote}</p>}
              {event.stackCount && <p>进展 {event.stackCount}</p>}
            </div>
          </div>

          <div className={styles['timeline-card-bottom']}>
            <EventContributorList contributorList={contributors} eventId={eventId} />
            <Timeline />
          </div>
        </Card>
      </a>
    </Link>
  );
};

export default TimelineCard;
