import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Skeleton, Space, Button, Select, message } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

import { ClientActions } from '@Actions';
import { ClientService, getNewsroomSocket } from '@Services';
import {
  getClient,
  getNewsroomClientRole,
  getLoggedInClientId,
  getNewsroomCurrentClientRole,
  canCurrentClientManageEvent,
} from '@Selectors';
import { ClientRoleConsts } from '@Definitions';
import { ClientAvatar } from '@Components/Client';

import { INewsroomPanelRoleItem } from './RoleItem';

const { Option } = Select;

const NewsroomPanelRoleItem: React.FunctionComponent<INewsroomPanelRoleItem.IProps> = ({
  eventId,
  clientId,
}) => {
  const dispatch = useDispatch();
  const client = useSelector(getClient(clientId));
  const role = useSelector(getNewsroomClientRole(eventId, clientId));
  const currentClientId = useSelector(getLoggedInClientId);
  const currentClientRole = useSelector(getNewsroomCurrentClientRole(eventId));
  const canEdit = useSelector(canCurrentClientManageEvent(eventId));

  if (!client || !role) {
    dispatch(ClientActions.GetClient(clientId));
    return <Skeleton title paragraph={false} />;
  }

  const handleSelectionChange = async (value: string) => {
    if (value === role) return;

    const socket = getNewsroomSocket(eventId);
    if (!socket) return;

    if (value === 'manager') await socket.inviteManager(clientId);
    else if (value === 'editor') await socket.inviteEditor(clientId);
    else if (value === 'viewer') await socket.inviteViewer(clientId);
    message.success('用户权限修改成功');
  };

  const handleRemoveButtonClick = async () => {
    const socket = getNewsroomSocket(eventId);
    if (!socket) return;
    await socket.changeRole(clientId, role, false);
    message.success(`成功移除用户「${client.username}」`);
  };

  const getRoleComponent = () => {
    if (!canEdit || role === 'owner' || clientId === currentClientId) {
      return <span>{ClientService.getRoleName(role)}</span>;
    }

    let roles = ClientRoleConsts.filter(r => r !== 'owner');
    if (currentClientRole !== 'owner') {
      roles = roles.filter(r => r !== 'manager');
    }

    return (
      <>
        <Select defaultValue={role} disabled={!canEdit} onChange={handleSelectionChange}>
          {roles.map(r => (
            <Option value={r} key={r}>
              {ClientService.getRoleName(r)}
            </Option>
          ))}
        </Select>
        <Button
          type="link"
          size="small"
          danger
          icon={<CloseOutlined />}
          onClick={handleRemoveButtonClick}
        />
      </>
    );
  };

  return (
    <div>
      <Space>
        <ClientAvatar showTooltip={false} clientId={clientId} />
        <span>{client.username}</span>
      </Space>
      <Space>{getRoleComponent()}</Space>
      <style jsx>
        {`
          div {
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: relative;
            margin: 0.5rem;
          }
        `}
      </style>
    </div>
  );
};

export { NewsroomPanelRoleItem };
