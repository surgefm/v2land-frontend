import React from 'react';
import css from 'styled-jsx/css';

import { useTranslation } from '@I18n';

import commonStyles from '@Static/css/common.module.scss';
import { IEventStats } from './Stats';

const styles = css`
  .status {
    font-size: 0.9rem;
  }
`;

const EventStatsComp: React.FunctionComponent<IEventStats.IProps> = ({
  stackCount = 0,
  newsCount = 0,
}) => {
  const { t } = useTranslation('common');

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
      <span>{t('Event_Stats_With')}</span>
      {stackCount ? (
        <span>
          <span className={commonStyles['light-font']}>{` ${stackCount} `}</span>
          {t('Event_Stats_Stacks')}
        </span>
      ) : (
        <React.Fragment />
      )}
      {stackCount && newsCount ? <span>{t('Event_Stats_Delineator')}</span> : <React.Fragment />}
      {newsCount ? (
        <span>
          <span className={commonStyles['light-font']}>{`${newsCount} `}</span>
          {t('Event_Stats_News')}
        </span>
      ) : (
        <React.Fragment />
      )}
      <style jsx>{styles}</style>
    </div>
  );
};

export const EventStats = EventStatsComp;
