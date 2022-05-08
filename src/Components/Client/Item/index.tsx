import React from 'react';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { Skeleton, Typography } from 'antd';

import { getClient } from '@Selectors';
import { ClientAvatar } from '../Avatar';

export const ClientItem = ({ clientId }: { clientId: number }) => {
  const client = useSelector(getClient(clientId));

  const content = (
    <div className="container">
      <ClientAvatar clientId={clientId} size={24} showTooltip={false} />
      {!!client && (
        <Typography.Text ellipsis className="span">
          <b>{client.nickname && `${client.nickname} `}</b>@{client.username}
        </Typography.Text>
      )}
      {!client && (
        <Skeleton active title={false} paragraph={{ rows: 1 }} style={{ width: '4rem' }} />
      )}
      <style jsx>
        {`
          .container {
            display: flex;
            align-items: center;
            padding: 0.25rem;
            cursor: pointer;
            background-color: rgba(0, 0, 0, 0);
            transition: all 0.2s;
            border-radius: 0.25rem;
          }

          .container:hover {
            background-color: rgba(0, 0, 0, 0.03);
          }

          .container :global(.span) {
            margin-left: 0.5rem;
          }
        `}
      </style>
    </div>
  );

  if (client) {
    return (
      <Link href={`/@${client.username}`}>
        <a>{content}</a>
      </Link>
    );
  }
  return content;
};
