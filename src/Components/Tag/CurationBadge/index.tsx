/* eslint-disable react/require-default-props */
import React from 'react';
import { Tooltip } from 'antd';
import Link from 'next/link';
import {
  SafetyCertificateTwoTone,
  WarningTwoTone,
  AlertTwoTone,
  QuestionCircleTwoTone,
} from '@ant-design/icons';

import { TagCuration } from '@Interfaces';
import { Tag } from '../index';

export const TagCurationBadge = ({
  curations,
  style = {},
  onlyShowReviewed = false,
}: {
  curations: TagCuration[];
  style?: React.CSSProperties;
  onlyShowReviewed?: boolean;
}) => {
  let message: React.ReactNode = '该时间线暂未有话题主持人评分，不一定符合社区编辑标准，请谨慎浏览';
  const isWarned = curations.find(c => c.state === 'warning');
  const needImprovement = curations.find(c => c.state === 'need improvement');
  const isCertified = curations.find(c => c.state === 'certified');

  if (isWarned) {
    message = (
      <span>
        该时间线被
        <Tag tagId={isWarned.tagId} style={{ margin: '0 .25rem' }} />
        的话题主持人标记为「不良时间线」，请谨慎浏览。
        {isWarned.comment && <>理由：“{isWarned.comment}”</>}
      </span>
    );
  } else if (needImprovement) {
    message = (
      <span>
        该时间线被
        <Tag tagId={needImprovement.tagId} style={{ margin: '0 .25rem' }} />
        的话题主持人标记为「需改进」。
        {needImprovement.comment && <>理由：“{needImprovement.comment}”</>}
      </span>
    );
  } else if (isCertified) {
    message = (
      <span>
        该时间线被
        <Tag tagId={isCertified.tagId} style={{ margin: '0 .25rem' }} />
        的话题主持人标记为「符合
        <Link
          href="/wiki"
          style={{
            borderTop: '1px solid transparent',
            borderBottom: '1px solid #fff',
            color: '#fff',
          }}>
            社区编辑标准
        </Link>
        」。
        {isCertified.comment && <>点评：“{isCertified.comment}”</>}
      </span>
    );
  }

  const badgeStyle = { fontSize: '1.5rem', ...style };

  return (
    <Tooltip title={message} align={{ offset: [0, 4] }}>
      {!onlyShowReviewed &&
        (!isWarned && !needImprovement && !isCertified && (
          <QuestionCircleTwoTone style={badgeStyle} />
        ))}
      {!isWarned && !needImprovement && isCertified && (
        <SafetyCertificateTwoTone style={badgeStyle} />
      )}
      {isWarned && <AlertTwoTone twoToneColor="red" style={badgeStyle} />}
      {!isWarned && needImprovement && <WarningTwoTone twoToneColor="orange" style={badgeStyle} />}
    </Tooltip>
  );
};
