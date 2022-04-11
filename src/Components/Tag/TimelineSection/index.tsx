import React from 'react';
import StackGrid from 'react-stack-grid';
import { getTagEventIdList } from '@Selectors';
import { useSelector } from 'react-redux';
import { TimelineCard } from '../TimelineCard';
import { ITimelineSection } from './TimelineSection';

const TimelineSection: React.FunctionComponent<ITimelineSection.IProps> = ({ tagId }) => {
  const tagEventIdList = useSelector(getTagEventIdList(tagId));

  const StackGridImpl = StackGrid as any;

  return (
    <div className="timeline-section">
      <StackGridImpl
        columnWidth={380}
        style={{ width: 'calc(100% - 4rem)' }}
        gutterWidth={24}
        duration={0}
      >
        {tagEventIdList.map(id => (
          <TimelineCard eventId={id} key={id} />
        ))}
      </StackGridImpl>

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
