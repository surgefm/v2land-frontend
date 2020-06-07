import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Skeleton, Space, Button, Select, AutoComplete, Tooltip, message } from 'antd';
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
import { Client } from '@Interfaces';
import { ClientActions, NewsroomActions } from '@Actions';
import { ClientService, RedstoneService, getNewsroomSocket } from '@Services';

import { ClientAvatar } from '@Components/Client';
import { INewsroomPanelRoleItemCreator } from './RoleItemCreator';

const { Option } = Select;

const NewsroomPanelRoleItemCreator: React.FunctionComponent<
  INewsroomPanelRoleItemCreator.IProps
> = ({ eventId }) => {
  const dispatch = useDispatch();
  const newsroomRoles = useSelector(getNewsroomRoles(eventId));
  const currentClientRole = useSelector(getNewsroomCurrentClientRole(eventId));
  const currentClientId = useSelector(getLoggedInClientId);
  const isConnected = useSelector(isNewsroomSocketConnected(eventId));
  const [role, setRole] = useState('viewer');
  const [result, setResult] = useState<Client[]>([]);
  const [input, setInput] = useState('');
  const [timer, setTimer] = useState<number>();
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
    message.success(`成功添加用户「${client.username}」`);
    setInput('');
  };

  const isClientChangeable = (id: number) => {
    if (currentClientId === id) return false;
    if (!newsroomRoles) return true;
    if (currentClientRole === 'owner' && newsroomRoles.owners.includes(id)) return false;
    return !newsroomRoles.owners.includes(id) && !newsroomRoles.managers.includes(id);
  };

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
      <Tooltip title="确认添加">
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

  const search = async (value: string) => {
    if (value.length === 0) {
      setResult([]);
      return;
    }
    const { clientList } = await RedstoneService.findClients(value);
    const list: Client[] = [];
    for (let i = 0; i < clientList.length; i += 1) {
      const c = clientList[i];
      dispatch(ClientActions.AddClient(c));
      if (isClientChangeable(c.id)) list.push(c);
    }
    setResult(list);
  };

  const handleSearch = (value: string) => {
    if (timer) clearTimeout(timer);
    setTimer(setTimeout(() => search(value), 200));
  };

  return (
    <div>
      <Space>
        {clientId ? <ClientAvatar showTooltip={false} clientId={clientId} /> : <Skeleton.Avatar />}
        <AutoComplete
          value={input}
          style={{ width: 200 }}
          onSearch={handleSearch}
          onChange={setInput}
          placeholder="请输入用户名"
          disabled={!isConnected}
        >
          {result.map(c => (
            <AutoComplete.Option key={`client-${c.id}`} value={c.username}>
              <Space>
                <ClientAvatar clientId={c.id} />
                {c.nickname ? <span style={{ marginRight: '0.25rem' }}>{c.nickname}</span> : null}
                <span>@{c.username}</span>
              </Space>
            </AutoComplete.Option>
          ))}
        </AutoComplete>
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

export { NewsroomPanelRoleItemCreator };
