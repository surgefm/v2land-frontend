import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, Tooltip, Skeleton } from 'antd';
import { UserOutlined } from '@ant-design/icons';

import { ClientActions } from '@Actions';
import { getClient } from '@Selectors';
import { ClientService } from '@Services';

import { IClientAvatar } from './Avatar';

export const ClientAvatar: React.FunctionComponent<IClientAvatar.IProps> = ({ clientId, role }) => {
  const client = useSelector(getClient(clientId));
  const dispatch = useDispatch();

  if (!client) {
    dispatch(ClientActions.GetClient(clientId));
  }

  const getTooltipText = () => {
    if (!client) return <Skeleton />;
    return (
      <span>
        {client.username}
        {role ? `: ${ClientService.getRoleName(role)}` : ''}
      </span>
    );
  };

  const getAvatar = () => {
    if (!client) return <Avatar icon={<UserOutlined />} />;
    if (client.avatar) return <Avatar src={client.avatar} />;
    return <Avatar>{client.username[0]}</Avatar>;
  };

  return (
    <Tooltip placement="bottom" title={getTooltipText()}>
      {getAvatar()}
    </Tooltip>
  );
};
