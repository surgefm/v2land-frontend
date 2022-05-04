import React from 'react';
import { useSelector } from 'react-redux';
import { Space } from 'antd';

import { getNewsroomClients, getActiveNewsroomId, getLoggedInClientId } from '@Selectors';
import { ClientAvatar } from '@Components/Client';

export const NewsroomHeaderClientAvatars: React.FunctionComponent = () => {
  const eventId = useSelector(getActiveNewsroomId);
  const loggedInClientId = useSelector(getLoggedInClientId);
  const newsroomClients = useSelector(getNewsroomClients(eventId)).filter(
    c => c !== loggedInClientId
  );
  return (
    <Space size={4} style={{ height: '2rem', display: 'flex' }}>
      {newsroomClients.map(clientId => (
        <ClientAvatar
          clientId={clientId}
          eventId={eventId}
          key={`client-${clientId}`}
          asLink
          showRole
        />
      ))}
    </Space>
  );
};
