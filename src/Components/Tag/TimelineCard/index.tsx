import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link';
import { Skeleton, Timeline } from 'antd';

import { getEvent, getEventContributorIdList, getEventOwner, getStackList } from '@Selectors';
import { UtilService } from '@Services';
import { EventContributorList, Card } from '@Components';
import { ThunkDispatch } from '@Interfaces';
import { EventActions } from '@Actions';
import { withTranslation } from '@I18n';

import { ITimelineCard } from './TimelineCard';
import styles from './TimelineCard.module.scss';

const TimelineCardImpl: React.FunctionComponent<ITimelineCard.IProps> = ({ eventId, t }) => {
  const event = useSelector(getEvent(eventId));
  const contributors = useSelector(getEventContributorIdList(eventId));
  const eventOwner = useSelector(getEventOwner(eventId));
  const dispatch = useDispatch() as ThunkDispatch;
  const stackList = useSelector(getStackList((event && event.stackIdList) || []));
  dispatch(EventActions.GetEvent(eventId));

  if (!event) {
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
              <div className={styles['latest-update']}>
                {event.time && (
                  <p>{UtilService.getTimeLapseString(t, event.time, 'general')}更新</p>
                )}
              </div>
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
            <div className={styles['timeline-list']}>
              <Timeline>
                {stackList.map(
                  (stack, index) => index < 3 && <Timeline.Item>{stack.title}</Timeline.Item>
                )}
              </Timeline>
            </div>
          </div>
        </Card>
      </a>
    </Link>
  );
};

export const TimelineCard = withTranslation('common')(TimelineCardImpl);
