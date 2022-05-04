import React from 'react';
import { useSelector } from 'react-redux';
import { Skeleton } from 'antd';

import { ChatMessage } from '@Interfaces';
import { UtilService } from '@Services';
import { ClientAvatar } from '@Components/Client';
import { getClient } from '@Selectors';

export const ChatroomMessage = ({ message }: { message: ChatMessage }) => {
  const client = useSelector(getClient(message.authorId));

  const time = new Date(message.createdAt);
  const now = new Date();
  const sameDay =
    now.getDate() === time.getDate() &&
    now.getMonth() === time.getMonth() &&
    now.getFullYear() === time.getFullYear();

  const Name = () => {
    if (!client)
      return <Skeleton active title={false} paragraph={{ rows: 1 }} style={{ width: '4rem' }} />;
    if (client.nickname)
      return (
        <span>
          <b>{client.nickname}</b> @{client.username}
        </span>
      );
    return <b>@{client.username}</b>;
  };

  return (
    <div className="message">
      <div className="avatar">
        <ClientAvatar clientId={message.authorId} size={32} showTooltip={false} />
      </div>
      <p style={{ paddingLeft: '.5rem' }}>
        <span className="name">
          <Name />
          <span className="time">
            {sameDay ? '' : `${UtilService.getTimeString(time, { withSpaceBetween: false })} `}
            {time.getHours()}:{`0${time.getMinutes()}`.slice(-2)}
          </span>
        </span>
        <span>{message.text}</span>
      </p>
      <style jsx>
        {`
          .message {
            display: flex;
            padding: 0.075rem 0.6rem;
          }

          .name {
            display: flex;
            align-items: center;
            line-height: 1.2;
            margin-bottom: 0.25rem;
          }

          .name :global(.ant-skeleton-paragraph) {
            margin: 0 0.25rem 0;
          }

          .name :global(.ant-skeleton-paragraph) :global(li) {
            width: 100% !important;
          }

          .time {
            padding-left: 0.4rem;
            color: rgba(0, 0, 0, 0.3);
          }
        `}
      </style>
    </div>
  );
};
