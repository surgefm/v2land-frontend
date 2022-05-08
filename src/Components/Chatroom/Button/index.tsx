import React, { useState, useEffect } from 'react';
import { useStore, useSelector } from 'react-redux';
import { Button, Badge } from 'antd';
import { MessageOutlined } from '@ant-design/icons';

import { getChatroomSocket } from '@Services/Socket/chatroom';
import { getChatId } from '@Services/Utils';
import { getChatroomMessages } from '@Selectors';

import { ChatroomWindow } from '../Window';
import { ChatroomButtonProps } from './Button';

export const ChatroomButton: React.FC<ChatroomButtonProps> = ({
  type,
  ids,
  openByDefault = false,
  presetMessage,
}) => {
  const store = useStore();
  let socket = getChatroomSocket(type, ids, store);
  const chatId = getChatId(type, ids);
  const [lastReadAt, setLastReadAt] = useState(new Date());
  const [isOpen, setIsOpen] = useState(openByDefault);
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
      {isOpen && (
        <ChatroomWindow type={type} ids={ids} onClose={close} presetMessage={presetMessage} />
      )}
      <style jsx>
        {`
          .container {
            position: fixed;
            bottom: ${isOpen ? 0 : 1.5}rem;
            right: 1rem;
            z-index: 201;
          }

          .container :global(.icon) {
            font-size: 1.75rem;
          }

          .container :global(.button) {
            width: 3rem;
            height: 3rem;
          }

          :global(.fab) {
            ${isOpen ? 'display: none !important;' : ''}
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
