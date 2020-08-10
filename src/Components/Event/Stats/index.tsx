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
  stackCount = 0,
  newsCount = 0,
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
      <span>{'This timeline has '}</span>
      {stackCount ? (
        <span>
          <span className={commonStyles['light-font']}>{`${stackCount} `}</span>
          {`stack${t('Common_S', { count: stackCount })}`}
        </span>
      ) : (
        <React.Fragment />
      )}
      {stackCount && newsCount ? <span>{' and '}</span> : <React.Fragment />}
      {newsCount ? (
        <span>
          <span className={commonStyles['light-font']}>{`${newsCount} `}</span>
          {`piece${t('Common_S', { count: newsCount })} of news`}
        </span>
      ) : (
        <React.Fragment />
      )}
      <span>.</span>
      <style jsx>{styles}</style>
    </div>
  );
};

export const EventStats = withTranslation('common')(EventStatsComp);
