import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Skeleton, Space, Button, Select, Tooltip, message } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

import { ClientActions } from '@Actions';
import { ClientService, getNewsroomSocket } from '@Services';
import {
  getClient,
  getNewsroomClientRole,
  getLoggedInClientId,
  getNewsroomCurrentClientRole,
  canCurrentClientManageEvent,
  isNewsroomSocketConnected,
} from '@Selectors';
import { ClientRoleConsts } from '@Definitions';
import { withTranslation } from '@I18n';
import { ClientAvatar } from '@Components/Client';

import { INewsroomPanelRoleItem } from './RoleItem';

const { Option } = Select;

const NewsroomPanelRoleItemImpl: React.FunctionComponent<INewsroomPanelRoleItem.IProps> = ({
  eventId,
  clientId,
  t,
}) => {
  const dispatch = useDispatch();
  const client = useSelector(getClient(clientId));
  const role = useSelector(getNewsroomClientRole(eventId, clientId));
  const currentClientId = useSelector(getLoggedInClientId);
  const currentClientRole = useSelector(getNewsroomCurrentClientRole(eventId));
  const canEdit = useSelector(canCurrentClientManageEvent(eventId));
  const isConnected = useSelector(isNewsroomSocketConnected(eventId));

  if (!client || !role) {
    dispatch(ClientActions.GetClient(clientId));
  }

  const handleSelectionChange = async (value: string) => {
    if (value === role) return;

    const socket = getNewsroomSocket(eventId);
    if (!socket) return;

    if (value === 'manager') await socket.inviteManager(clientId);
    else if (value === 'editor') await socket.inviteEditor(clientId);
    else if (value === 'viewer') await socket.inviteViewer(clientId);
    message.success(t('Newsroom_RoleItem_UpdateSuccess'));
  };

  const handleRemoveButtonClick = async () => {
    if (!client || !role) return;
    const socket = getNewsroomSocket(eventId);
    if (!socket) return;
    await socket.changeRole(clientId, role, false);
    message.success(t('Newsroom_RemoveSuccess', { username: client.username }));
  };

  const getRoleComponent = () => {
    if (!role) return <Skeleton.Button active size="small" />;
    if (
      !canEdit ||
      role === 'owner' ||
      clientId === currentClientId ||
      (currentClientRole === 'manager' && role === 'manager')
    ) {
      return <span>{ClientService.getRoleName(role)}</span>;
    }

    let roles = ClientRoleConsts.filter(r => r !== 'owner');
    if (currentClientRole !== 'owner') {
      roles = roles.filter(r => r !== 'manager');
    }

    return (
      <>
        <Select
          style={{ width: '90px' }}
          defaultValue={role}
          disabled={!canEdit || !isConnected}
          onChange={handleSelectionChange}
        >
          {roles.map(r => (
            <Option value={r} key={r}>
              {ClientService.getRoleName(r)}
            </Option>
          ))}
        </Select>
        <Tooltip title={t('Newsroom_Tooltip')}>
          <Button
            type="link"
            size="small"
            danger
            icon={<CloseOutlined />}
            onClick={handleRemoveButtonClick}
          />
        </Tooltip>
      </>
    );
  };

  return (
    <div>
      <Space>
        <ClientAvatar showTooltip={false} clientId={clientId} />
        {client ? (
          <span>
            {client.nickname ? `${client.nickname} ` : ''}@{client.username}
          </span>
        ) : (
          <Skeleton.Input style={{ width: '150px' }} active size="small" />
        )}
      </Space>
      <Space>{getRoleComponent()}</Space>
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

export const NewsroomPanelRoleItem = withTranslation('common')(NewsroomPanelRoleItemImpl);
