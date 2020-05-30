import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, Tooltip, Skeleton } from 'antd';

import { ClientActions } from '@Actions';
import { getClient, getNewsroomClientRole } from '@Selectors';
import { ClientService, UtilService } from '@Services';

import { IClientAvatar } from './Avatar';

export const ClientAvatar: React.FunctionComponent<IClientAvatar.IProps> = ({
  clientId,
  eventId,
  role,
  showTooltip = true,
}) => {
  const client = useSelector(getClient(clientId));
  const clientRole = useSelector(getNewsroomClientRole(eventId || 0, clientId));
  const dispatch = useDispatch();

  if (!client) {
    dispatch(ClientActions.GetClient(clientId));
  }

  const getTooltipText = () => {
    if (!client) return <Skeleton title={false} paragraph={{ rows: 1, width: 100 }} active />;
    return (
      <span>
        {client.username}
        {role || clientRole ? `：${ClientService.getRoleName(role || (clientRole as string))}` : ''}
      </span>
    );
  };

  const getAvatar = () => {
    if (!client) return <Skeleton.Avatar active />;
    if (client.avatar) return <Avatar src={UtilService.getImageUrl(client.avatar, 128, 128)} />;
    return <Avatar>{client.username[0].toUpperCase()}</Avatar>;
  };

  if (!showTooltip) {
    return getAvatar();
  }

  return (
    <Tooltip title={getTooltipText()} overlayClassName="avatar-icon-tooltip">
      <div>
        {getAvatar()}
        <style jsx>
          {`
            :global(.avatar-icon-tooltip) :global(.ant-skeleton-paragraph) {
              margin: 0.125rem 0;
            }
          `}
        </style>
      </div>
    </Tooltip>
  );
};
