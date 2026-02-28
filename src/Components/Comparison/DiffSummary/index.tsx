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
  baseLabel = '已提交版本',
  targetLabel = '草稿',
}) => {
  if (!diffResult.hasChanges) {
    return (
      <div className="diff-summary">
        <Alert
          type="success"
          icon={<CheckCircleOutlined />}
          showIcon
          message={`未检测到变更。${targetLabel}与${baseLabel}完全一致。`}
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
  if (added > 0) parts.push(`新增 ${added} 个进展`);
  if (removed > 0) parts.push(`删除 ${removed} 个进展`);
  if (modified > 0) parts.push(`修改 ${modified} 个进展`);

  const eventChanges: string[] = [];
  if (diffResult.eventDiff.nameChanged) eventChanges.push('名称');
  if (diffResult.eventDiff.descriptionChanged) eventChanges.push('描述');
  if (eventChanges.length > 0) {
    parts.push(`事件${eventChanges.join('和')}已变更`);
  }

  return (
    <div className="diff-summary">
      <Alert
        type="info"
        icon={<InfoCircleOutlined />}
        showIcon
        message={parts.join(' · ')}
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
