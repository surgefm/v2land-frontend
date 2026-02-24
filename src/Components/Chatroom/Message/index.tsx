/* eslint-disable react/jsx-wrap-multilines */
import React from 'react';
import { useSelector } from 'react-redux';
import { Skeleton, Tooltip, Typography } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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

  const lastReadBy = (message.lastReadBy || []).filter(id => id !== loggedInClientId);

  return (
    <div className="message">
      <div className="avatar">
        <ClientAvatar clientId={message.authorId} size={32} showTooltip={false} asLink />
      </div>
      <div style={{ padding: '0 .5rem .5rem .5rem', display: 'block', width: 'calc(100% - 2rem)' }}>
        <span className="name">
          {client && (
            <Typography.Text ellipsis style={{ minWidth: 0 }}>
              {client.nickname && <b key="nickname">{client.nickname} </b>}
              {`@${client.username}`}
            </Typography.Text>
          )}
          {client && (
            <span style={{ color: 'rgba(0, 0, 0, 0.3)', whiteSpace: 'nowrap', flexShrink: 0 }}>{timeStr}</span>
          )}
          {!client && (
            <Skeleton active title={false} paragraph={{ rows: 1 }} style={{ width: '4rem' }} />
          )}
        </span>
        <div className="message-text">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.text}</ReactMarkdown>
        </div>
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
            display: block;
            word-break: break-word;
          }

          .message-text :global(p) {
            margin: 0 0 0.25rem 0;
          }

          .message-text :global(p:last-child) {
            margin-bottom: 0;
          }

          .message-text :global(ul),
          .message-text :global(ol) {
            margin: 0.125rem 0;
            padding-left: 1.25rem;
          }

          .message-text :global(li) {
            margin-bottom: 0.125rem;
          }

          .message-text :global(a) {
            color: #1890ff;
            text-decoration: none;
          }

          .message-text :global(a:hover) {
            text-decoration: underline;
          }

          .message-text :global(code) {
            background-color: rgba(0, 0, 0, 0.05);
            padding: 0.1rem 0.3rem;
            border-radius: 3px;
            font-size: 0.85em;
          }

          .message-text :global(pre) {
            background-color: rgba(0, 0, 0, 0.04);
            padding: 0.5rem;
            border-radius: 4px;
            overflow-x: auto;
            margin: 0.25rem 0;
          }

          .message-text :global(pre code) {
            background-color: transparent;
            padding: 0;
          }

          .message-text :global(h1),
          .message-text :global(h2),
          .message-text :global(h3),
          .message-text :global(h4) {
            font-size: 1em;
            font-weight: bold;
            margin: 0.25rem 0;
          }

          .message-text :global(blockquote) {
            border-left: 3px solid #d9d9d9;
            margin: 0.25rem 0;
            padding-left: 0.5rem;
            color: rgba(0, 0, 0, 0.65);
          }

          .message-text :global(table) {
            border-collapse: collapse;
            margin: 0.25rem 0;
            font-size: 0.9em;
          }

          .message-text :global(th),
          .message-text :global(td) {
            border: 1px solid #d9d9d9;
            padding: 0.2rem 0.4rem;
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
