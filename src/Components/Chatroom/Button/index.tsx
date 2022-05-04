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
  let socket = getChatroomSocket(type, ids, store);
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
    socket = getChatroomSocket(type, ids, store);
  });

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
            icon={<MessageOutlined className="icon" />}
            onClick={open}
            type="primary"
            shape="circle"
            className="button"
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

          .container :global(.icon) {
            font-size: 1.75rem;
          }

          .container :global(.button) {
            width: 3rem;
            height: 3rem;
          }

          :global(.fab) {
            display: ${isOpen ? 'none' : 'block'} !important;
          }

          @media (max-width: 700px) {
            .container {
              right: initial;
              left: 1rem;
            }

            .container :global(.icon) {
              font-size: 1.35rem;
            }

            .container :global(.button) {
              width: 2.5rem;
              height: 2.5rem;
            }
          }
        `}
      </style>
    </div>
  );
};
