import React from 'react';
import H from 'next/head';
import { IHead } from './Head';

export const Head: React.FunctionComponent<IHead.IProps> = ({
  title: t = '',
  showSlogan = true,
}) => {
  let title = t;
  if (showSlogan) {
    title += t.length > 0 ? ' - 浪潮' : '浪潮 - 你的社会事件追踪工具';
  }

  return (
    <H>
      <title>{title}</title>
    </H>
  );
};
