import React from 'react';
import { useSelector } from 'react-redux';
import { Space } from 'antd';

import { useTranslation } from '@I18n';
import { getEventContributorIdList } from '@Selectors';
import { ClientAvatar } from '@Components/Client';

import { IEventContributorList } from './ContributorList';
import styles from './ContributorList.module.scss';

const EventContributorListComp: React.FunctionComponent<IEventContributorList.IProps> = ({
  contributorList,
  eventId,
}) => {
  const { t } = useTranslation('common');
  const contributorIdList = useSelector(getEventContributorIdList(eventId || 0));
  const list = contributorList || contributorIdList;

  if (!list || list.length === 0) return <span>{t('Event_ContributorList_NoContributor')}</span>;

  return (
    <Space size={4}>
      <span className={styles.label}>{t('Event_ContributorList_Contributor')}</span>
      {list.map(id => (
        <ClientAvatar key={`client-${id}`} clientId={id} asLink />
      ))}
    </Space>
  );
};

export const EventContributorList = EventContributorListComp;
