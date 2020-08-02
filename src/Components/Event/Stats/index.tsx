import React from 'react';
import css from 'styled-jsx/css';

import { withTranslation } from '@I18n';

import commonStyles from '@Static/css/common.scss';
import { IEventStats } from './Stats';

const styles = css`
  .status {
    font-size: 0.9rem;
  }
`;

const EventStatsComp: React.FunctionComponent<IEventStats.IProps> = ({
  stackCount,
  newsCount,
  t,
}) => {
  if (!newsCount && !stackCount) {
    return (
      <div className="status">
        <span className={commonStyles['light-font']}>{t('Event_Stats_WithNoNews')}</span>
        <style jsx>{styles}</style>
      </div>
    );
  }

  return (
    <div className="status">
      <span>{'事件共有 '}</span>
      {stackCount ? (
        <span>
          <span className={commonStyles['light-font']}>{`${stackCount} `}</span>
          个进展
        </span>
      ) : (
        <React.Fragment />
      )}
      {stackCount && newsCount ? <span>、</span> : <React.Fragment />}
      {newsCount ? (
        <span>
          <span className={commonStyles['light-font']}>{`${newsCount} `}</span>
          条新闻
        </span>
      ) : (
        <React.Fragment />
      )}
      <style jsx>{styles}</style>
    </div>
  );
};

export const EventStats = withTranslation('common')(EventStatsComp);
