import React from 'react';

import { ITime } from './Time';

export const Time: React.FunctionComponent<ITime.IProps> = ({ time: t, className, style }) => {
  if (!t) return <React.Fragment />;
  const time = typeof t === 'string' ? new Date(t) : t;
  return (
    <span className={className} style={style}>
      {time.getFullYear()}
      <div className="micro-separator" />
      年
      <div className="micro-separator" />
      {time.getMonth() + 1}
      <div className="micro-separator" />
      月
      <div className="micro-separator" />
      {time.getDate()}
      <div className="micro-separator" />日
      <style jsx>
        {`
          .micro-separator {
            display: inline-block;
            width: 0.2rem;
          }
        `}
      </style>
    </span>
  );
};
