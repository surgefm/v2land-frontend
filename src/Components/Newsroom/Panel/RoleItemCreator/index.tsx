import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Skeleton, Space, Button, Select, Tooltip, message } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';

import {
  getClient,
  getLoggedInClientId,
  getNewsroomRoles,
  getNewsroomCurrentClientRole,
  getClientIdWithUsername,
  isNewsroomSocketConnected,
} from '@Selectors';
import { ClientRoleConsts } from '@Definitions';
import { NewsroomActions } from '@Actions';
import { ClientService, getNewsroomSocket } from '@Services';
import { useTranslation } from '@I18n';

import { ClientAvatar } from '@Components/Client';
import { ClientSelector } from '@Components/Client/ClientSelector';
import { INewsroomPanelRoleItemCreator } from './RoleItemCreator';

const { Option } = Select;

const NewsroomPanelRoleItemCreatorImpl: React.FunctionComponent<
  INewsroomPanelRoleItemCreator.IProps
> = ({ eventId }) => {
  const { t } = useTranslation('common');
  const dispatch = useDispatch();
  const newsroomRoles = useSelector(getNewsroomRoles(eventId));
  const currentClientRole = useSelector(getNewsroomCurrentClientRole(eventId));
  const currentClientId = useSelector(getLoggedInClientId);
  const isConnected = useSelector(isNewsroomSocketConnected(eventId));
  const [role, setRole] = useState('viewer');
  const [input, setInput] = useState('');
  const clientId = useSelector(getClientIdWithUsername(input));
  const client = useSelector(getClient(clientId));

  const handleCancelButtonClick = () => {
    if (!clientId) {
      dispatch(NewsroomActions.SetNewsroomClientInvitationVisible(false));
    }
  };

  const inviteClient = async () => {
    if (!client) return;
    const socket = getNewsroomSocket(eventId);
    if (!socket) return;

    await socket.changeRole(clientId, role);
    message.success(t('Newsroom_RoleItemCreator_AddSuccess', { username: client.username }));
    setInput('');
  };

  const isClientChangeable = (id: number) => {
    if (currentClientId === id) return false;
    if (!newsroomRoles) return true;
    if (currentClientRole === 'owner' && newsroomRoles.owners.includes(id)) return false;
    return !newsroomRoles.owners.includes(id) && !newsroomRoles.managers.includes(id);
  };

  let exceptions = [currentClientId];
  if (currentClientRole === 'owner' && newsroomRoles)
    exceptions = [...exceptions, ...newsroomRoles.owners];
  if (currentClientRole !== 'owner' && newsroomRoles)
    exceptions = [...exceptions, ...newsroomRoles.managers];

  const getButton = () => {
    if (input.length === 0) {
      return (
        <Button
          type="link"
          size="small"
          icon={<CloseOutlined />}
          onClick={handleCancelButtonClick}
        />
      );
    }

    return (
      <Tooltip title={t('Newsroom_ConfirmAdd')}>
        <Button
          type="link"
          size="small"
          icon={<CheckOutlined />}
          disabled={!clientId || !isClientChangeable(clientId) || !isConnected}
          onClick={inviteClient}
        />
      </Tooltip>
    );
  };

  const getRoleComponent = () => {
    let roles = ClientRoleConsts.filter(r => r !== 'owner');
    if (currentClientRole !== 'owner') {
      roles = roles.filter(r => r !== 'manager');
    }

    return (
      <Select
        style={{ width: '90px' }}
        defaultValue={role}
        onChange={value => setRole(value as string)}
        disabled={!isConnected}
      >
        {roles.map(r => (
          <Option value={r} key={r}>
            {ClientService.getRoleName(r)}
          </Option>
        ))}
      </Select>
    );
  };

  return (
    <div>
      <Space>
        {clientId ? <ClientAvatar showTooltip={false} clientId={clientId} /> : <Skeleton.Avatar />}
        <ClientSelector
          value={input}
          onChange={setInput}
          disabled={!isConnected}
          placeholder={t('Newsroom_UsernamePlaceholder')}
          exceptions={exceptions}
        />
      </Space>
      <Space>
        {getRoleComponent()}
        {getButton()}
      </Space>
      <style jsx>
        {`
          div {
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: relative;
            padding: 0.25rem 0.5rem 0.25rem 0.25rem;
          }
        `}
      </style>
    </div>
  );
};

export const NewsroomPanelRoleItemCreator = NewsroomPanelRoleItemCreatorImpl;
