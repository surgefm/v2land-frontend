import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Input, Button, Typography, Empty } from 'antd';
import { SendOutlined, CloseOutlined, MessageTwoTone } from '@ant-design/icons';

import { getChatroomSocket } from '@Services/Socket/chatroom';
import { getChatId } from '@Services/Utils';
import { getChatroomMessages, getEvent, getEventOwner } from '@Selectors';

import { ChatroomMessage } from '../Message';
import { WindowProps } from './Window';

export const ChatroomWindow: React.FC<WindowProps> = ({ type, ids, onClose, presetMessage }) => {
  const socket = getChatroomSocket(type, ids);
  const chatId = getChatId(type, ids);
  const event = useSelector(getEvent(type === 'newsroom' ? -(ids as number) : 0));
  const eventOwner = useSelector(getEventOwner(type === 'newsroom' ? -(ids as number) : 0));
  const messages = useSelector(getChatroomMessages(chatId));
  const [message, setMessage] = useState(presetMessage || '');
  const [sending, setSending] = useState(false);

  let title = '讨论';
  if (type === 'newsroom' && event) {
    if (eventOwner) {
      title += ` — @${eventOwner.username}/${event.name}`;
    } else {
      title += ` — ${event.name}`;
    }
  }

  const sendMessage = async () => {
    if (!socket) return;
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
        <Typography.Text ellipsis style={{ margin: 0 }}>
          <MessageTwoTone /> {title}
        </Typography.Text>
        <Button type="text" icon={<CloseOutlined />} onClick={onClose} />
      </div>
      <div className="messages">
        {messages.map(m => (
          <ChatroomMessage key={m.id} message={m} />
        ))}
        {messages.length === 0 && (
          <div className="empty">
            <Empty description="在这里讨论如何编辑这条时间线吧" />
          </div>
        )}
        {messages.length > 0 && <p className="blank">.</p>}
      </div>
      <Input.Group compact>
        <Input
          style={{
            width: 'calc(100% - 2rem + 1px)',
            borderRadius: 0,
          }}
          defaultValue={message}
          value={message}
          onChange={val => setMessage(val.target.value)}
          onPressEnter={sendMessage}
          placeholder="请输入……"
        />
        <Button
          type="primary"
          icon={<SendOutlined />}
          style={{
            width: '2rem',
            borderRadius: 0,
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
            max-width: calc(100vw - 2rem);
            box-shadow: 0 4px 4px rgba(0, 0, 0, 0.01);
          }

          .header {
            height: 2.25rem;
            border: 1px solid #d9d9d9;
            border-top-left-radius: 0.5rem;
            border-top-right-radius: 0.5rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 0.25rem 0 0.5rem;
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

          .empty {
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
          }

          .blank {
            height: 0.25rem;
            visibility: hidden;
          }

          @media (max-width: 500px) {
            .container {
              width: 100vw;
            }
          }
        `}
      </style>
    </div>
  );
};

export default ChatroomWindow;
