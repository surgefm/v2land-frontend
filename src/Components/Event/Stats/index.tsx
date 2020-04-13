import React from 'react';
import { IEventStats } from './Stats';
import './style.scss';

export const EventStats: React.FunctionComponent<IEventStats.IProps> = ({
  stackCount,
  newsCount,
}) => {
  if (!newsCount && !stackCount) {
    return (
      <div className="status">
        <span className="light-font">事件尚无相关新闻</span>
      </div>
    );
  }

  return (
    <div className="status">
      <span>事件共有</span>
      {stackCount ? (
        <span>
          <span className="light-font number">{stackCount}</span>
          个进展
        </span>
      ) : (
        <div />
      )}
      {stackCount && newsCount ? <span>、</span> : <div />}
      {newsCount ? (
        <span>
          <span className="light-font number">{newsCount}</span>
          条新闻
        </span>
      ) : (
        <div />
      )}
    </div>
  );
};
