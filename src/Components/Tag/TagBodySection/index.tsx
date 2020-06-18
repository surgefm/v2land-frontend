/* eslint-disable react/jsx-indent */
/* eslint-disable prettier/prettier */
import React from 'react';
import { TimelineSection } from '../TimelineSection';

export interface TopicSectionInterface {
    createTimelineMode?: boolean;
    tagId: number;
}

const TagBodySection: React.FunctionComponent<TopicSectionInterface> = ({ tagId, createTimelineMode }) => {
    // const [timelineState, setTimelineState] = useState<TimeLineType[]>(timelineData.filter(data => data.eventId === eventId));

    // const topicList: string[] = [];

    // for (let i = 0; i < timelineState.length; i += 1) {
    //     for (let j = 0; j < timelineState[i].topics?.length; j += 1) {
    //         if (!topicList.includes(timelineState[i].topics[j])) topicList.push(timelineState[i].topics[j]);
    //     }
    // }

    return (
        <div className='topic-section'>
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
    )
}

export { TagBodySection };