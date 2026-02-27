import React from 'react';
import { Alert } from 'antd';
import {
  CheckCircleOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';

import { DiffResult } from '../hooks/useDiffData';

interface IProps {
  diffResult: DiffResult;
  baseLabel?: string;
  targetLabel?: string;
}

export const DiffSummary: React.FC<IProps> = ({
  diffResult,
  baseLabel = 'committed version',
  targetLabel = 'draft',
}) => {
  if (!diffResult.hasChanges) {
    return (
      <div className="diff-summary">
        <Alert
          type="success"
          icon={<CheckCircleOutlined />}
          showIcon
          message={`No changes detected. The ${targetLabel} is identical to the ${baseLabel}.`}
        />
        <style jsx>
          {`
            .diff-summary {
              margin-bottom: 1rem;
            }
          `}
        </style>
      </div>
    );
  }

  const added = diffResult.stackDiffs.filter(d => d.status === 'added').length;
  const removed = diffResult.stackDiffs.filter(d => d.status === 'removed').length;
  const modified = diffResult.stackDiffs.filter(d => d.status === 'modified').length;

  const parts: string[] = [];
  if (added > 0) parts.push(`${added} stack${added > 1 ? 's' : ''} added`);
  if (removed > 0) parts.push(`${removed} stack${removed > 1 ? 's' : ''} removed`);
  if (modified > 0) parts.push(`${modified} stack${modified > 1 ? 's' : ''} modified`);

  const eventChanges: string[] = [];
  if (diffResult.eventDiff.nameChanged) eventChanges.push('name');
  if (diffResult.eventDiff.descriptionChanged) eventChanges.push('description');
  if (eventChanges.length > 0) {
    parts.push(`event ${eventChanges.join(' and ')} changed`);
  }

  return (
    <div className="diff-summary">
      <Alert
        type="info"
        icon={<InfoCircleOutlined />}
        showIcon
        message={parts.join(' \u00b7 ')}
      />
      <style jsx>
        {`
          .diff-summary {
            margin-bottom: 1rem;
          }
        `}
      </style>
    </div>
  );
};
