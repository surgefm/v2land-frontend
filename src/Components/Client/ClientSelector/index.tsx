import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AutoComplete, Space } from 'antd';

import { ClientActions } from '@Actions';
import { Client } from '@Interfaces';
import { RedstoneService } from '@Services';

import { ClientAvatar } from '../Avatar';
import { IClientSelector } from './ClientSelector';

export const ClientSelector: React.FC<IClientSelector.IProps> = ({
  value,
  placeholder = '',
  onChange = () => {},
  onSelect = () => {},
  exceptions = [],
  disabled,
}) => {
  const dispatch = useDispatch();
  const [result, setResult] = useState<Client[]>([]);
  const [timer, setTimer] = useState<number>();

  useEffect(() => {
    setResult([]);
  }, [value]);

  const search = async (val: string) => {
    let v = val;
    if (v[0] === '@') v = v.slice(1);
    if (v.length === 0) {
      setResult([]);
      return;
    }
    const { clientList } = await RedstoneService.findClients(v);
    const list: Client[] = [];
    for (let i = 0; i < clientList.length; i += 1) {
      const c = clientList[i];
      dispatch(ClientActions.AddClient(c));
      if (!exceptions.includes(c.id)) list.push(c);
    }
    setResult(list);
  };

  const handleSearch = (val: string) => {
    if (timer) clearTimeout(timer);
    setTimer(setTimeout(() => search(val), 200));
  };

  return (
    <AutoComplete
      value={value}
      style={{ width: 200 }}
      onSearch={handleSearch}
      onChange={onChange}
      onSelect={onSelect}
      placeholder={placeholder}
      disabled={disabled}
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
  );
};
