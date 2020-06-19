import React from 'react';
import { useSelector } from 'react-redux';

import { EventTitle, EventDescription, Share } from '@Components';
import { getTag, getTagEventIdList } from '@Selectors';

import { ITagHeaderCard } from './TagHeaderCard';

export const TagHeaderCard: React.FunctionComponent<ITagHeaderCard.IProps> = ({ tagId }) => {
  const tag = useSelector(getTag(tagId));
  const timelines = useSelector(getTagEventIdList(tagId));
  const numTimeline = timelines.length;

  return (
    tag && (
      <div className="event-header-card">
        <div className="left">
          <EventTitle>{tag.name}</EventTitle>
          <EventDescription description={tag.description || '该话题暂无简介'} />
          <div className="bottom">
            <div className="share">
              <Share type="tag" tag={tag} tagId={tag.id} />
            </div>
          </div>
        </div>

        <div className="right">
          <div>
            <div className="open-for-edit">
              <div className="open-for-edit-circle" />
              <p>
                <strong>开放编辑</strong>
              </p>
            </div>

            <div className="number-of-timeline">
              <p style={{ color: 'rgba(0, 153, 239, 1)' }} id="number-of-timeline-number">
                <strong>{numTimeline}</strong>
              </p>
              <p>
                <strong>条时间线</strong>
              </p>
            </div>
          </div>

          {/* <div className={`button ${createTimelineMode && 'cancel-button'}`}>
            <Button
              style={{ backgroundColor: 'black', borderColor: 'black' }}
              type="primary"
              onClick={onCreateTimeline}
            >
              {createTimelineMode ? '取消' : '创建时间线'}
            </Button>
          </div> */}
        </div>

        <style jsx>
          {`
            .event-header-card {
              margin: -4rem -4rem 2rem;
              padding: 4rem 18% 2rem 18%;
              background-color: white;
              display: flex;
              flex-direction: row;
              justify-content: space-between;
            }

            .button {
              display: flex;
              justify-content: flex-end;
            }

            .cancel-button {
              padding-right: 2.7rem;
              margin-right: 0.6rem;
            }

            .left {
              max-width: 100rem;
            }

            .open-for-edit {
              display: flex;
              flex-direction: row;
              align-items: center;
              justify-content: flex-end;
            }

            .open-for-edit p {
              margin-bottom: 0;
            }

            .open-for-edit-circle {
              width: 0.6rem;
              height: 0.6rem;
              border-radius: 50%;
              background-color: rgba(105, 189, 37, 1);
              margin-right: 0.75rem;
            }

            .number-of-timeline {
              display: flex;
              flex-direction: row;
              align-items: center;
              justify-content: flex-end;
            }

            #number-of-timeline-number {
              margin-right: 0.75rem;
            }

            .right {
              width: 25rem;
              padding-left: 8rem;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
            }

            .right p {
              font-size: 1rem;
            }

            .share {
              width: 18rem;
              display: flex;
              flex-direction: row;
              align-items: center;
              justify-content: space-between;
            }

            .bottom {
              padding-top: 3rem;
              width: 20rem;
              display: flex;
              flex-direction: column;
              align-items: flex-start;
              margin-top: 0.5rem;
              justify-content: space-between;
            }
          `}
        </style>
      </div>
    )
  );
};
