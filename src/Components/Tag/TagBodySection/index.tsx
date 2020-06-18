import React from 'react';
import { TimelineSection } from '../TimelineSection';
import { ITagBodySection } from './TagBodySection';

const TagBodySection: React.FunctionComponent<ITagBodySection.IProps> = ({
  tagId,
  createTimelineMode,
}) => {
  // const topicList: string[] = [];

  return (
    <div className="topic-section">
      {/* <div className='topic-list'>
                {topicList.map(topic => {
                    return (
                        <Tag tagId={} />
                    );
                })}
            </div> */}

      <TimelineSection tagId={tagId} createTimelineMode={createTimelineMode} />

      <style jsx>
        {`
          .topic-list {
            display: flex;
            justify-content: flex-start;
            max-width: 78vw;
            margin-left: 4vw;
          }
        `}
      </style>
    </div>
  );
};

export { TagBodySection };
