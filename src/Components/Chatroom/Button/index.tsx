import React, { useState, useEffect } from 'react';
import { useStore, useSelector } from 'react-redux';
import { Button, Badge } from 'antd';
import { MessageOutlined } from '@ant-design/icons';

import { getChatroomSocket, getChatroomId } from '@Services';
import { getChatroomMessages } from '@Selectors';

import { ChatroomWindow } from '../Window';

interface ButtonProps {
  type: 'client' | 'newsroom';
  ids: number | number[];
}

export const ChatroomButton: React.FC<ButtonProps> = ({ type, ids }) => {
  const store = useStore();
  const socket = getChatroomSocket(type, ids, store);
  const chatId = getChatroomId(type, ids);
  const [lastReadAt, setLastReadAt] = useState(new Date());
  const [isOpen, setIsOpen] = useState(false);
  const [numUnread, setNumUnread] = useState(0);
  const messages = useSelector(getChatroomMessages(chatId));

  useEffect(() => {
    socket.joinChatroom();

    return () => {
      socket.destroy();
    };
  }, []);

  useEffect(() => {
    if (isOpen) return;
    const count = messages.filter(m => new Date(m.createdAt) > lastReadAt).length;
    setNumUnread(count);
  }, [messages, isOpen]);

  const open = () => {
    setIsOpen(true);
    setNumUnread(0);
  };

  const close = () => {
    setIsOpen(false);
    setNumUnread(0);
    setLastReadAt(new Date());
  };

  return (
    <div className="container">
      {!isOpen && (
        <Badge count={numUnread} color="gold" offset={[-5, 5]}>
          <Button
            icon={<MessageOutlined style={{ fontSize: '1.75rem' }} />}
            onClick={open}
            type="primary"
            shape="circle"
            style={{ width: '3rem', height: '3rem' }}
          />
        </Badge>
      )}
      {isOpen && <ChatroomWindow type={type} ids={ids} onClose={close} />}
      <style jsx>
        {`
          .container {
            position: fixed;
            bottom: 1.5rem;
            right: 1rem;
            z-index: 100000;
          }

          @media (max-width: 600px) {
            .container {
              right: initial;
              left: 1rem;
            }
          }
        `}
      </style>
    </div>
  );
};
