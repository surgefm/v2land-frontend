import React from 'react';
import { useSelector } from 'react-redux';
import { Collapse } from 'antd';

import { getEvent } from '@Selectors';

import { EventDiff } from '../hooks/useDiffData';

const { Panel } = Collapse;

interface IProps {
  baseEventId: number;
  targetEventId: number;
  diff: EventDiff;
}

const FieldDiff: React.FC<{ label: string; oldValue: string; newValue: string }> = ({
  label,
  oldValue,
  newValue,
}) => (
  <div className="field-diff">
    <span className="label">{label}:</span>
    <div className="values">
      <span className="old-value">{oldValue || '(empty)'}</span>
      <span className="arrow">&rarr;</span>
      <span className="new-value">{newValue || '(empty)'}</span>
    </div>
    <style jsx>
      {`
        .field-diff {
          padding: 0.5rem 0;
          border-bottom: 1px solid #f0f0f0;
        }

        .field-diff:last-child {
          border-bottom: none;
        }

        .label {
          font-weight: 600;
          margin-right: 0.5rem;
          display: inline-block;
          min-width: 6rem;
        }

        .values {
          display: inline;
        }

        .old-value {
          color: #ff4d4f;
          text-decoration: line-through;
          margin-right: 0.5rem;
        }

        .arrow {
          margin-right: 0.5rem;
          color: #999;
        }

        .new-value {
          color: #52c41a;
        }
      `}
    </style>
  </div>
);

export const EventDetailDiff: React.FC<IProps> = ({
  baseEventId,
  targetEventId,
  diff,
}) => {
  const baseEvent = useSelector(getEvent(baseEventId));
  const targetEvent = useSelector(getEvent(targetEventId));

  const hasChanges = diff.nameChanged || diff.descriptionChanged;
  if (!hasChanges || !baseEvent || !targetEvent) return null;

  return (
    <div className="event-detail-diff">
      <Collapse ghost>
        <Panel header="Event detail changes" key="1">
          {diff.nameChanged && (
            <FieldDiff
              label="Name"
              oldValue={baseEvent.name}
              newValue={targetEvent.name}
            />
          )}
          {diff.descriptionChanged && (
            <FieldDiff
              label="Description"
              oldValue={baseEvent.description}
              newValue={targetEvent.description}
            />
          )}
        </Panel>
      </Collapse>
      <style jsx>
        {`
          .event-detail-diff {
            margin-bottom: 1rem;
            background: #fff;
            border-radius: 0.5rem;
            box-shadow: 0 2.5px 7.5px rgba(0, 0, 0, 0.0375);
          }
        `}
      </style>
    </div>
  );
};
