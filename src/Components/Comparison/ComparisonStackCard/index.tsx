import React from 'react';
import { useSelector } from 'react-redux';

import { getStack, getStackNewsIdList, getStackTime } from '@Selectors';
import { Card, Time } from '@Components/Basic';

import { ComparisonNewsItem } from '../ComparisonNewsItem';
import { InlineDiff } from '../InlineDiff';
import { ChangeStatus } from '../hooks/useDiffData';

interface IProps {
  stackId: number;
  status: ChangeStatus;
  newsAdded?: number[];
  newsRemoved?: number[];
  titleChanged?: boolean;
  descriptionChanged?: boolean;
  timeChanged?: boolean;
  orderChanged?: boolean;
  baseOrder?: number;
  baseTitle?: string;
  baseDescription?: string;
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
  orderChanged = false,
  baseOrder,
  baseTitle,
  baseDescription,
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
      ? '新增'
      : status === 'removed'
      ? '已删除'
      : undefined;

  return (
    <div ref={cardRef} className={`comparison-card-wrapper ${status}`}>
      <Card styles={{ paddingTop: '0', paddingBottom: '0.75rem' }}>
        <div className="stack">
          <div className="stack-main">
            {typeof stack.order === 'number' && (
              <span className={`order${orderChanged ? ' order-changed' : ''}`}>
                {orderChanged && baseOrder !== undefined && (
                  <span className="order-old">{baseOrder + 1}</span>
                )}
                {stack.order + 1}
              </span>
            )}
            <div className="title">
              {time && (
                <span className={timeChanged ? 'field-changed' : ''}>
                  <Time time={time} />
                </span>
              )}
              <h2 className={titleChanged && !baseTitle ? 'field-changed' : ''}>
                {titleChanged && baseTitle !== undefined ? (
                  <InlineDiff oldText={baseTitle} newText={stack.title || ''} />
                ) : (
                  stack.title
                )}
              </h2>
            </div>
          </div>

          {(stack.description || (descriptionChanged && baseDescription)) && (
            <div className="content-area">
              <p className={descriptionChanged && baseDescription === undefined ? 'field-changed' : ''}>
                {descriptionChanged && baseDescription !== undefined ? (
                  <InlineDiff oldText={baseDescription} newText={stack.description || ''} />
                ) : (
                  stack.description
                )}
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

          {status === 'modified' && (
            <div className="diff-summary">
              {[
                orderChanged && baseOrder !== undefined
                  ? `顺序 ${baseOrder + 1} → ${(stack.order ?? 0) + 1}`
                  : orderChanged && '顺序',
                titleChanged && '标题',
                descriptionChanged && '描述',
                timeChanged && '时间',
                newsAdded.length > 0 && `${newsAdded.length} 条新闻新增`,
                newsRemoved.length > 0 && `${newsRemoved.length} 条新闻删除`,
              ].filter(Boolean).join(' · ')}
              {'  已修改'}
            </div>
          )}
        </div>
      </Card>

      <style jsx>
        {`
          .comparison-card-wrapper {
            position: relative;
            border-radius: 0.5rem;
            transition: all 0.3s;
            border-left: 3px solid transparent;
          }

          .comparison-card-wrapper.added {
            border-left-color: #52c41a;
          }

          .comparison-card-wrapper.removed {
            border-left-color: #ff4d4f;
            opacity: 0.7;
          }

          .comparison-card-wrapper.modified {
            border-left-color: #fa8c16;
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
            position: relative;
          }

          .order-changed {
            color: #fa8c16;
          }

          .order-old {
            font-size: 0.4em;
            color: #b31d28;
            text-decoration: line-through;
            position: absolute;
            top: -0.2em;
            left: 0;
            opacity: 0.7;
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

          .diff-summary {
            font-size: 0.75rem;
            color: #fa8c16;
            margin-top: 0.5rem;
            padding: 0.25rem 0;
            opacity: 0.85;
          }

          @media (max-width: 768px) {
            .comparison-card-wrapper {
              margin-bottom: 0;
            }

            .order {
              font-size: 1.75rem;
              line-height: 1.75rem;
              margin-top: 0.5rem;
              margin-right: 0.35rem;
            }

            .title {
              padding-top: 0.5rem;
            }

            h2 {
              font-size: 0.95rem;
              line-height: 1.4;
              display: -webkit-box;
              -webkit-line-clamp: 3;
              -webkit-box-orient: vertical;
              overflow: hidden;
            }

            .content-area p {
              font-size: 0.8rem;
              line-height: 1.5;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              overflow: hidden;
            }

            .news-list {
              margin-top: 0.25rem;
            }
          }
        `}
      </style>
    </div>
  );
};
