import React from 'react';
import Link from 'next/link';
import { Typography } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';

import { PopularChatroom } from '@Interfaces';
import { ClientAvatar } from '@Components/Client';

type ChatroomCardProps = {
  chatroom: PopularChatroom;
};

export const ChatroomCard: React.FC<ChatroomCardProps> = ({ chatroom }) => {
  const Card = () => {
    let name = (
      <Typography.Text ellipsis className="username" strong>
        @{chatroom.eventOwner.username}
      </Typography.Text>
    );
    if (chatroom.eventOwner.nickname) {
      name = (
        <Typography.Text ellipsis className="username">
          <strong>{chatroom.eventOwner.nickname}</strong> @{chatroom.eventOwner.username}
        </Typography.Text>
      );
    }

    return (
      <Link
        href={{
          pathname: '/[username]/[eventName]/newsroom',
          query: {
            username: `@${chatroom.eventOwner.username}`,
            eventName: `${chatroom.event.id}-${chatroom.event.pinyin}`,
            c: 1,
          },
        }}
      >
        <div className="card">
          <div className="avatar">
            <ClientAvatar clientId={chatroom.eventOwner.id} showTooltip={false} size={40} />
          </div>
          <div className="names">
            {name}
            <Typography.Text
              ellipsis
              style={{ color: '#333', lineHeight: 1.2, marginTop: '.1rem' }}
            >
              {chatroom.event.name}
            </Typography.Text>
          </div>

          <style jsx>
            {`
              .card {
                max-width: 18rem;
                display: flex;
                align-items: center;
                padding: 0.25rem 0.5rem 0.25rem 0.25rem;
                border-radius: 0.5rem;
                border-top-left-radius: 1000px;
                border-bottom-left-radius: 1000px;
                transition: all 0.2s;
                position: relative;
                cursor: pointer;
              }

              .avatar {
                margin-right: 0.5rem;
              }

              .names {
                display: grid;
              }

              .card :global(.username) {
                font-size: 12px;
                line-height: 1.2;
                color: rgba(0, 0, 0, 0.5);
              }
            `}
          </style>
        </div>
      </Link>
    );
  };

  return (
    <div className="container">
      <div className="phantom">
        <ArrowRightOutlined className="arrow" />
        <Card />
      </div>
      <Card />

      <style jsx>
        {`
          .container,
          .phantom {
            max-width: 18rem;
            display: flex;
            align-items: center;
            margin-left: -0.25rem;
            transition: all 0.2s;
            position: relative;
          }

          .phantom {
            width: 100%;
            max-width: 18rem;
            position: absolute;
            opacity: 0;
            transform: translateX(0.25rem);
            background-color: #fff;
            transition: all 0.2s;
            border-radius: 1rem;
            border-top-left-radius: 1000px;
            border-bottom-left-radius: 1000px;
            overflow: hidden;
            z-index: 100;
          }

          .container:hover .phantom {
            opacity: 1;
          }

          .phantom :global(.arrow) {
            font-size: 12px;
            position: absolute;
            right: 0.55rem;
            top: 0.55rem;
            background-color: #fff;
            z-index: 100;
          }
        `}
      </style>
    </div>
  );
};
