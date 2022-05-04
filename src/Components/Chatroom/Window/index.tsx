import React, { useEffect, useState } from 'react';
import { useStore, useSelector } from 'react-redux';
import { Input, Button } from 'antd';
import { SendOutlined, CloseOutlined } from '@ant-design/icons';

import { getChatroomSocket, getChatroomId } from '@Services';
import { getChatroomMessages } from '@Selectors';

import { ChatroomMessage } from '../Message';

interface WindowProps {
  type: 'client' | 'newsroom';
  ids: number | number[];
}

export const ChatroomWindow: React.FC<WindowProps> = ({ type, ids }) => {
  const store = useStore();
  const socket = getChatroomSocket(type, ids, store);
  const chatId = getChatroomId(type, ids);
  const messages = useSelector(getChatroomMessages(chatId));
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    socket.joinChatroom();
  }, []);

  const sendMessage = async () => {
    if (message.trim().length === 0) return;
    try {
      setSending(true);
      await socket.sendMessage(message.trim());
      setMessage('');
    } catch (err) {
      // Do nothing
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="container">
      <div className="header">
        <Button type="text" icon={<CloseOutlined />} />
      </div>
      <div className="messages">
        {messages.map(m => (
          <ChatroomMessage key={m.id} message={m} />
        ))}
        <p className="blank">.</p>
      </div>
      <Input.Group compact>
        <Input
          style={{
            width: 'calc(100% - 2rem + 1px)',
            borderRadius: 0,
            borderBottomLeftRadius: '.5rem',
          }}
          defaultValue={message}
          value={message}
          onChange={val => setMessage(val.target.value)}
          onPressEnter={sendMessage}
        />
        <Button
          type="primary"
          icon={<SendOutlined />}
          style={{
            width: '2rem',
            borderTopRightRadius: 0,
            borderBottomRightRadius: '0.5rem',
          }}
          loading={sending}
          onClick={sendMessage}
        />
      </Input.Group>
      <style jsx>
        {`
          .container {
            display: flex;
            flex-direction: column;
            background-color: #ffffff;
            border-radius: 0.5rem;
            width: 18rem;
          }

          .header {
            height: 2.25rem;
            border: 1px solid #d9d9d9;
            border-top-left-radius: 0.5rem;
            border-top-right-radius: 0.5rem;
            display: flex;
            justify-content: flex-end;
            align-items: center;
            padding: 0 0.25rem;
            background-color: rgba(0, 0, 0, 0.01);
          }

          .messages {
            width: 100%;
            height: 20rem;
            overflow: auto;
            display: flex;
            flex-direction: column-reverse;
            border-left: 1px solid #d9d9d9;
            border-right: 1px solid #d9d9d9;
          }

          .blank {
            height: 0.25rem;
            visibility: hidden;
          }
        `}
      </style>
    </div>
  );
};
