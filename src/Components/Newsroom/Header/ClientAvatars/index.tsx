import React from 'react';
import { useSelector } from 'react-redux';
import { Space } from 'antd';

import { getNewsroomClients, getActiveNewsroomId } from '@Selectors';
import { ClientAvatar } from '@Components/Client';

export const NewsroomHeaderClientAvatars: React.FunctionComponent = () => {
  const eventId = useSelector(getActiveNewsroomId);
  const newsroomClients = useSelector(getNewsroomClients(eventId));
  return (
    <Space size={4} style={{ height: '2rem', display: 'flex' }}>
      {newsroomClients.map(clientId => (
        <ClientAvatar clientId={clientId} eventId={eventId} key={`client-${clientId}`} asLink />
      ))}
    </Space>
  );
};
