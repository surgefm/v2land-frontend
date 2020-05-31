import React from 'react';
import { useSelector } from 'react-redux';
import { Space } from 'antd';

import { getEventContributorIdList } from '@Selectors';
import { ClientAvatar } from '@Components/Client';

import { IEventContributorList } from './ContributorList';

export const EventContributorList: React.FunctionComponent<IEventContributorList.IProps> = ({
  contributorList,
  eventId,
}) => {
  const contributorIdList = useSelector(getEventContributorIdList(eventId || 0));
  const list = contributorList || contributorIdList;

  return (
    <Space size={2}>
      <span>贡献者：</span>
      {list.map(id => (
        <ClientAvatar key={`client-${id}`} clientId={id} asLink />
      ))}
    </Space>
  );
};
