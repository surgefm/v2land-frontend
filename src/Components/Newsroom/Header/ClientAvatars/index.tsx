import React from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { Space } from 'antd';

import { getNewsroomClients } from '@Selectors';
import { ClientAvatar } from '@Components/Client';

export const NewsroomHeaderClientAvatars: React.FunctionComponent = () => {
  const eventId = +useRouter().query.eventName;
  const newsroomClients = useSelector(getNewsroomClients(eventId));
  return (
    <Space size={4}>
      {newsroomClients.map(client => (
        <ClientAvatar clientId={client.id} role={client.role} key={`client-${client.id}`} />
      ))}
    </Space>
  );
};
