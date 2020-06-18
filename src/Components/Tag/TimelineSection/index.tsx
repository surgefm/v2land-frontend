import React from 'react';
import StackGrid from 'react-stack-grid';
import { Card } from '@Components/Basic';
import { Input, Button } from 'antd';
import { getTagEventIdList, getEventList } from '@Selectors';
import { useSelector } from 'react-redux';
import TimelineCard from '../TimelineCard';
import { ITimelineSection } from './TimelineSection';

export const CreateTimelineCard = () => {
  return (
    <div className="create-timeline-card">
      <Card>
        <div className="title">
          <h2>事件信息</h2>
        </div>

        <div className="input-section">
          <div className="event-name-section">
            <p>事件名</p>
            <Input />
          </div>

          <div className="event-name-section">
            <p>简介</p>
            <Input.TextArea autoSize />
          </div>
        </div>

        <div className="action-section">
          <Button style={{ marginRight: '0.2rem' }} type="primary">
            提交
          </Button>
          <Button type="link">放弃</Button>
        </div>
      </Card>

      <style jsx>
        {`
          .create-timeline-card {
            margin-top: 3rem;
            width: 23rem;
          }

          .create-name-section {
            display: flex;
            flex-direction: column;
          }

          .input-section p {
            margin-bottom: 0.5rem;
          }

          .input-section div {
            margin-bottom: 1rem;
          }

          .action-section {
            margin-top: 2rem;
            display: flex;
            flex-direction: row;
            justify-content: flex-end;
          }
        `}
      </style>
    </div>
  );
};

const TimelineSection: React.FunctionComponent<ITimelineSection.IProps> = ({
  tagId,
  createTimelineMode,
}) => {
  const tagEventIdList = useSelector(getTagEventIdList(tagId));
  const eventList = useSelector(getEventList(tagEventIdList));

  return (
    <div className="timeline-section">
      <StackGrid
        columnWidth={380}
        style={{ width: '80vw' }}
        gutterHeight={-28}
        gutterWidth={10}
        duration={0}
      >
        {createTimelineMode && <CreateTimelineCard />}
        {eventList.map(event => {
          return (
            event && (
              <TimelineCard eventId={event.id}>
                <p>{event.description}</p>
              </TimelineCard>
            )
          );
        })}
      </StackGrid>

      <style jsx>
        {`
          .timeline-section {
            display: flex;
            justify-content: center;
          }
        `}
      </style>
    </div>
  );
};

export { TimelineSection };
