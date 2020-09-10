import React from 'react';

import { UtilService } from '@Services';
import { ITime } from './Time';

export const Time: React.FunctionComponent<ITime.IProps> = ({ time: t, className, style }) => {
  if (!t) return <React.Fragment />;
  const time = typeof t === 'string' ? new Date(t) : t;
  return (
    <span className={className} style={style}>
      {UtilService.getTimeString(time, { showFullMonth: false })}
    </span>
  );
};
