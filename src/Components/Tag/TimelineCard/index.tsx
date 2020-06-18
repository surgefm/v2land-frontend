import React from 'react';
import { useSelector } from 'react-redux';
import { getEvent, getEventContributorIdList, getEventOwner } from '@Selectors';
import { UtilService } from '@Services';
import { EventContributorList } from '@Components';
import Link from 'next/link';
import { ITimelineCard } from './TimelineCard';

export const Timeline = () => {
  return <></>;
};

const TimelineCard: React.FunctionComponent<ITimelineCard.IProps> = ({ eventId, children }) => {
  const event = useSelector(getEvent(eventId));
  const contributors = useSelector(getEventContributorIdList(eventId));
  const eventOwner = useSelector(getEventOwner(eventId));

  if (!event) return <React.Fragment />;

  return (
    <Link href="/[username]/[eventName]" as={UtilService.getEventPath(event, eventOwner)}>
      <div className="timeline-card">
        <div className="timeline-card-top">
          <div className="title">
            <p>最新更新 {UtilService.getTimeLapseString(event.time)}</p>
            <h2>{event.name}</h2>
          </div>

          <div className="editor-list">
            <EventContributorList contributorList={contributors} eventId={eventId} />
          </div>

          {children && <div className="description">{children}</div>}

          <div className="info">
            {event.numUpvote && <p>赞 {event.numUpvote}</p>}
            {event.stackCount && <p>进展 {event.stackCount}</p>}
          </div>
        </div>

        <div className="timeline-card-bottom">
          <Timeline />
        </div>

        <style jsx>
          {`
            .timeline-card {
              margin-top: 3rem;
              width: 23rem;
              background-color: white;
              color: white;
              border-radius: 0.4rem;
              transition: all 0.3s;
            }

            .timeline-card:hover {
              box-shadow: 0 7.5px 32px rgba(0, 0, 0, 0.075), 0 2.5px 7.5px rgba(0, 0, 0, 0.0375);
            }

            .timeline-card-top {
              padding: 1.3rem 1.3rem 0.6rem 1.3rem;
              background-color: #0288d1;
              border-radius: 0.4rem;
            }

            .timeline-card-bottom {
            }

            .title p {
              font-size: 0.7rem;
              margin-bottom: 0.1rem;
            }

            .title h2 {
              font-size: 1.5rem;
              margin-bottom: 0.1rem;
              color: white;
            }

            .editor-list {
              display: flex;
              flex-direction: row;
              margin-bottom: 1rem;
            }

            .editor-list a {
              margin-bottom: 1.5rem;
              color: white;
              margin-right: 0.5rem;
              flex-wrap: wrap;
              height: 1.6rem;
              font-weight: 320;
            }

            .editor-list a:hover {
              border-bottom: solid 2px;
              cursor: pointer;
            }

            .description {
              font-size: 1rem;
              line-height: 1.7rem;
            }

            .info {
              display: flex;
              flex-direction: row;
            }

            .info p {
              padding-right: 0.5rem;
            }
          `}
        </style>
      </div>
    </Link>
  );
};

export default TimelineCard;
