import React from 'react';
import { useSelector } from 'react-redux';
import { getTagEventIdList } from '@Selectors';
import { Wall } from '@Components/Basic';
import { TimelineCard } from '../TimelineCard';
import { ITimelineSection } from './TimelineSection';

const TimelineSection: React.FunctionComponent<ITimelineSection.IProps> = ({ tagId }) => {
  const tagEventIdList = useSelector(getTagEventIdList(tagId));

  return (
    <div className="timeline-section">
      <Wall
        elementProps={tagEventIdList.map(id => ({ eventId: id }))}
        elementWidth={28}
        gutterWidth={1}
        Component={TimelineCard}
        key={JSON.stringify(tagEventIdList)}
      />

      <style jsx>
        {`
          .timeline-section {
            display: flex;
            padding-top: 1rem;
            justify-content: center;
          }
        `}
      </style>
    </div>
  );
};

export { TimelineSection };
