/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link';
import { Skeleton, Timeline, Button, Modal } from 'antd';

import {
  getEvent,
  getEventContributorIdList,
  getEventOwner,
  getStackList,
  canCurrentClientEditTag,
} from '@Selectors';
import { UtilService } from '@Services';
import { EventContributorList } from '@Components/Event';
import { Card } from '@Components/Basic';
import { ThunkDispatch } from '@Interfaces';
import { EventActions } from '@Actions';
import { useTranslation } from '@I18n';

import { TagCurationBadge } from '../CurationBadge';
import { TagCurationForm } from '../CurationForm';
import { ITimelineCard } from './TimelineCard';
import styles from './TimelineCard.module.scss';

const TimelineCardImpl: React.FunctionComponent<ITimelineCard.IProps> = ({ eventId, tagId }) => {
  const { t } = useTranslation('common');
  const event = useSelector(getEvent(eventId));
  const contributors = useSelector(getEventContributorIdList(eventId));
  const eventOwner = useSelector(getEventOwner(eventId));
  const dispatch = useDispatch() as ThunkDispatch;
  const stackList = useSelector(getStackList((event && event.stackIdList) || []));
  const canEdit = useSelector(canCurrentClientEditTag(tagId));
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    dispatch(EventActions.GetEvent(eventId));
  }, []);

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

  let time: Date | null = null;
  if (event.commitTime) {
    const commitTime = ((event.commitTime as any) as string).replaceAll('-', '/');
    time = new Date(Date.parse(commitTime.slice(0, 19) + commitTime.slice(23)));
  }

  const addCuration = async (e: React.MouseEvent) => {
    if (canEdit) {
      e.preventDefault();
      e.stopPropagation();
      setVisible(true);
    }
  };

  return (
    <>
      <Link href="/[username]/[eventName]" as={UtilService.getEventPath(event, eventOwner)}>
        <a>
          <Card className={styles['timeline-card']}>
            <div className={styles['timeline-card-top']}>
              <div className={styles.title}>
                <Button
                  style={{ float: 'right', right: '-.5rem', marginTop: '-.5rem' }}
                  type="text"
                  shape="circle"
                  onClick={addCuration}
                  icon={(
                    <TagCurationBadge curations={event.curations || []} />
                )}
                />
                <div className={styles['latest-update']}>
                  {time && <p>{UtilService.getTimeLapseString(t, time, 'general')}</p>}
                </div>
                <h2>{event.name}</h2>
              </div>

              {event.description && <p className={styles.description}>{event.description}</p>}

              <div className={styles.info}>
                {(event.numUpvote || 0) > 0 && <p>{event.numUpvote} 个人赞</p>}
                {(event.stackCount || 0) > 0 && <p>共有 {event.stackCount} 个进展</p>}
              </div>
            </div>

            <div className={styles['timeline-card-bottom']}>
              <EventContributorList contributorList={contributors} eventId={eventId} />
              <div className={styles['timeline-list']}>
                <Timeline>
                  {stackList.map(
                  (stack, index) =>
                    index < 3 && <Timeline.Item key={stack.id}>{stack.title}</Timeline.Item>
                )}
                </Timeline>
              </div>
            </div>
          </Card>
        </a>
      </Link>

      <Modal visible={visible} footer={null} title="点评时间线">
        <TagCurationForm
          tagId={tagId}
          eventId={eventId}
          curations={event.curations || []}
          onCancel={() => setVisible(false)}
          onSubmit={() => setVisible(false)}
        />
      </Modal>
    </>
  );
};

export const TimelineCard = TimelineCardImpl;
