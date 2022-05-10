/* eslint-disable react/jsx-wrap-multilines */
import React from 'react';
import { useSelector } from 'react-redux';
import { Skeleton, Tooltip, Typography } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';

import { ChatMessage } from '@Interfaces';
import { UtilService } from '@Services';
import { ClientAvatar, ClientItem } from '@Components/Client';
import { getClient, getLoggedInClientId } from '@Selectors';

export const ChatroomMessage = ({ message }: { message: ChatMessage }) => {
  const client = useSelector(getClient(message.authorId));
  const loggedInClientId = useSelector(getLoggedInClientId);

  const time = new Date(message.createdAt);
  const now = new Date();
  const sameDay =
    now.getDate() === time.getDate() &&
    now.getMonth() === time.getMonth() &&
    now.getFullYear() === time.getFullYear();

  let timeStr = ` ${time.getHours()}:${`0${time.getMinutes()}`.slice(-2)}`;
  if (!sameDay) {
    timeStr = ` ${UtilService.getTimeString(time, { withSpaceBetween: false })}${timeStr}`;
  }
  timeStr = (<span style={{ color: 'rgba(0, 0, 0, 0.3)' }}>{timeStr}</span> as any) as string;

  const lastReadBy = (message.lastReadBy || []).filter(id => id !== loggedInClientId);

  return (
    <div className="message">
      <div className="avatar">
        <ClientAvatar clientId={message.authorId} size={32} showTooltip={false} asLink />
      </div>
      <div style={{ padding: '0 .5rem .5rem .5rem', display: 'block', width: 'calc(100% - 2rem)' }}>
        <span className="name">
          {client && (
            <Typography.Text
              ellipsis={{
                suffix: timeStr,
              }}
            >
              {client.nickname && <b>{client.nickname} </b>}@{client.username}
            </Typography.Text>
          )}
          {!client && (
            <Skeleton active title={false} paragraph={{ rows: 1 }} style={{ width: '4rem' }} />
          )}
        </span>
        <span className="message-text">{message.text}</span>
        <div className="read-by" style={{ height: lastReadBy.length > 0 ? '16px' : '0' }}>
          {lastReadBy.slice(0, 4).map(clientId => (
            <div className="read-by-item" key={clientId}>
              <ClientAvatar clientId={clientId} size={16} asLink />
            </div>
          ))}
          {lastReadBy.length > 4 && (
            <Tooltip
              color="#fff"
              placement="topRight"
              arrowPointAtCenter
              title={
                <div className="user-list">
                  {lastReadBy.map(clientId => (
                    <div className="read-by-item" key={clientId}>
                      <ClientItem clientId={clientId} />
                    </div>
                  ))}
                </div>
              }
            >
              <div className="read-by-item more">
                <span>
                  <EllipsisOutlined />
                </span>
              </div>
            </Tooltip>
          )}
        </div>
      </div>
      <style jsx>
        {`
          .message {
            display: flex;
            padding: 0.075rem 0 0.075rem 0.6rem;
          }

          .name {
            display: flex;
            align-items: center;
            line-height: 1.2;
            margin-bottom: 0.25rem;
          }

          .name :global(.ant-skeleton-paragraph) {
            margin: 0 0.25rem 0 0;
          }

          .name :global(.ant-skeleton-paragraph) :global(li) {
            width: 100% !important;
          }

          .message-text {
            white-space: normal;
            display: inline;
          }

          .read-by {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            transition: all 0.2s linear;
          }

          .read-by-item:not(:last-child) {
            margin-right: 0.2rem;
          }

          .read-by-item.more {
            font-size: 9.6px;
          }

          .read-by-item.more span {
            display: inline-block;
            text-align: center;
            line-height: 16px;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background-color: rgba(0, 0, 0, 0.05);
            box-shadow: 0 0 2px rgb(0 0 0 / 10%);
            transition: all 0.2s;
            cursor: pointer;
          }

          .read-by-item.more span:hover {
            background-color: rgba(0, 0, 0, 0.1);
          }

          .user-list {
            display: flex;
            flex-direction: column;
          }
        `}
      </style>
    </div>
  );
};
