import React from 'react';
import { useSelector } from 'react-redux';

import { getStack, getStackNewsIdList, getStackTime } from '@Selectors';
import { Card, Time } from '@Components/Basic';

import { ComparisonNewsItem } from '../ComparisonNewsItem';
import { ChangeStatus } from '../hooks/useDiffData';

interface IProps {
  stackId: number;
  status: ChangeStatus;
  newsAdded?: number[];
  newsRemoved?: number[];
  titleChanged?: boolean;
  descriptionChanged?: boolean;
  timeChanged?: boolean;
  cardRef?: (el: HTMLDivElement | null) => void;
}

export const ComparisonStackCard: React.FC<IProps> = ({
  stackId,
  status,
  newsAdded = [],
  newsRemoved = [],
  titleChanged = false,
  descriptionChanged = false,
  timeChanged = false,
  cardRef,
}) => {
  const stack = useSelector(getStack(stackId));
  const newsIdList = useSelector(getStackNewsIdList(stackId));
  const time = useSelector(getStackTime(stackId));

  if (!stack) {
    return (
      <div ref={cardRef} className="placeholder-card">
        <style jsx>
          {`
            .placeholder-card {
              min-height: 4rem;
              border: 2px dashed #d9d9d9;
              border-radius: 0.5rem;
              margin-bottom: 1.25rem;
              opacity: 0.5;
            }
          `}
        </style>
      </div>
    );
  }

  const newsAddedSet = new Set(newsAdded);
  const newsRemovedSet = new Set(newsRemoved);

  const getNewsStatus = (nid: number): ChangeStatus => {
    const absId = Math.abs(nid);
    if (newsAddedSet.has(absId)) return 'added';
    if (newsRemovedSet.has(absId)) return 'removed';
    return 'unchanged';
  };

  const statusLabel =
    status === 'added'
      ? 'NEW'
      : status === 'removed'
      ? 'REMOVED'
      : undefined;

  return (
    <div ref={cardRef} className={`comparison-card-wrapper ${status}`}>
      <Card styles={{ paddingTop: '0', paddingBottom: '0.75rem' }}>
        <div className="stack">
          <div className="stack-main">
            {typeof stack.order === 'number' && (
              <span className="order">{stack.order + 1}</span>
            )}
            <div className="title">
              {time && (
                <span className={timeChanged ? 'field-changed' : ''}>
                  <Time time={time} />
                </span>
              )}
              <h2 className={titleChanged ? 'field-changed' : ''}>{stack.title}</h2>
            </div>
          </div>

          {stack.description && (
            <div className="content-area">
              <p className={descriptionChanged ? 'field-changed' : ''}>
                {stack.description}
              </p>
            </div>
          )}

          {newsIdList && newsIdList.length > 0 && (
            <div className="news-list">
              {newsIdList.map(nid => (
                <ComparisonNewsItem
                  key={nid}
                  newsId={nid}
                  status={getNewsStatus(nid)}
                />
              ))}
            </div>
          )}

          {statusLabel && (
            <div className="status-label">{statusLabel}</div>
          )}
        </div>
      </Card>

      <style jsx>
        {`
          .comparison-card-wrapper {
            position: relative;
            border-left: 4px solid transparent;
            border-radius: 0.5rem;
            transition: all 0.3s;
          }

          .comparison-card-wrapper.added {
            border-left-color: #52c41a;
            background-color: #f6ffed;
          }

          .comparison-card-wrapper.removed {
            border-left-color: #ff4d4f;
            background-color: #fff2f0;
            border-style: dashed;
            opacity: 0.8;
          }

          .comparison-card-wrapper.modified {
            border-left-color: #fa8c16;
            background-color: #fff7e6;
          }

          .comparison-card-wrapper.unchanged {
            border-left-color: #d9d9d9;
          }

          .title {
            padding-top: 0.8rem;
          }

          h2 {
            line-height: 1.5;
            display: block;
            margin-bottom: 0;
          }

          .stack-main {
            overflow: hidden;
          }

          .content-area {
            margin-top: 0.5rem;
          }

          .content-area p {
            line-height: 1.8;
            display: block;
            white-space: break-spaces;
          }

          .order {
            display: inline-block;
            font-family: 'Lexend Giga', sans-serif;
            margin-top: 0.75rem;
            font-size: 3.5rem;
            line-height: 3.35rem;
            color: rgb(30, 139, 195);
            float: left;
            margin-right: 0.5rem;
            opacity: 1;
          }

          .field-changed {
            background-color: #fefce8;
            border-radius: 0.25rem;
            padding: 0 0.25rem;
          }

          .news-list {
            margin-top: 0.5rem;
          }

          .status-label {
            text-align: center;
            font-size: 0.75rem;
            font-weight: 700;
            letter-spacing: 0.1em;
            margin-top: 0.5rem;
            padding: 0.25rem 0;
            border-radius: 0.25rem;
            opacity: 0.8;
          }

          .added .status-label {
            color: #52c41a;
          }

          .removed .status-label {
            color: #ff4d4f;
          }
        `}
      </style>
    </div>
  );
};
