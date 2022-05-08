/* eslint-disable react/require-default-props */
import React, { useState, createRef, useEffect } from 'react';
import Link from 'next/link';
import { Typography } from 'antd';
import { MessageTwoTone, EditTwoTone, CompassTwoTone, BellTwoTone } from '@ant-design/icons';

import { PopularChatroom } from '@Interfaces';
import { ClientAvatar } from '@Components/Client';

type ChatroomCardProps = {
  chatroom: PopularChatroom;
  asCard?: boolean;
};

export const ChatroomCard: React.FC<ChatroomCardProps> = ({ chatroom, asCard = false }) => {
  const {
    editorIds,
    speakerIds,
    editorIdsNow,
    speakerIdsNow,
    chatterIds,
    unreadMessagesCount,
  } = chatroom;
  const divRef = createRef<HTMLDivElement>();

  const showUnread = unreadMessagesCount > 0;
  const showNow = editorIdsNow.length > 0 || chatterIds.length > 0 || speakerIdsNow.length > 0;
  const showViewer =
    chatterIds.length > editorIdsNow.length * 5 && chatterIds.length > speakerIdsNow.length * 5;
  const showActivity = showNow || editorIds.length > 0 || speakerIds.length > 0;
  let showEditor = false;
  let showSpeaker = false;
  let ids: number[] = [];

  if (showNow) {
    showEditor = !showViewer && editorIdsNow.length > speakerIdsNow.length;
    showSpeaker = !showViewer && !showEditor;
    if (showViewer) ids = chatterIds;
    if (showEditor) ids = editorIdsNow;
    if (showSpeaker) ids = speakerIdsNow;
  } else if (showActivity) {
    showEditor = editorIds.length > speakerIds.length;
    showSpeaker = !showEditor;
    ids = showEditor ? editorIds : speakerIds;
  } else {
    ids = [chatroom.event.ownerId];
  }

  const [numAvatar, setNumAvatar] = useState(ids.length);

  const resize = () => {
    if (asCard) {
      setNumAvatar(Math.min(ids.length, 5));
      return;
    }

    if (!divRef.current || !window) return;
    const node = divRef.current;
    const width = node.offsetWidth;
    const rem = parseFloat(window.getComputedStyle(document.documentElement).fontSize);
    const nameWidth = (node.children[0] as HTMLSpanElement).offsetWidth;
    const statusWidth = (node.children[1] as HTMLDivElement).offsetWidth;
    let remaining = width - nameWidth - statusWidth - 0.5 * rem - (statusWidth > 0 ? 0.5 * rem : 0);
    if (remaining < 20) {
      setNumAvatar(0);
      return;
    }
    remaining -= 20;
    const num = 1 + Math.floor(remaining / 12);
    setNumAvatar(num);
  };

  useEffect(() => {
    resize();
    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
    };
  });

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
      <div className={`card ${asCard && 'white'}`}>
        <Typography.Paragraph ellipsis={{ rows: 1 }} className="title">
          {chatroom.event.name}
        </Typography.Paragraph>
        <div className="second-line" ref={divRef}>
          <span className="username">@{chatroom.eventOwner.username}</span>
          {showActivity ? (
            <div className="stats">
              {showUnread ? (
                <span style={{ color: 'rgb(24, 144, 255)' }}>
                  <BellTwoTone /> {chatroom.unreadMessagesCount}条消息未读{' '}
                </span>
              ) : (
                <>
                  {showViewer && (
                    <span style={{ color: 'rgb(24, 144, 255)' }}>
                      <CompassTwoTone /> {ids.length}人在线
                    </span>
                  )}
                  {showSpeaker && (
                    <span style={{ color: 'rgb(24, 144, 255)' }}>
                      <MessageTwoTone /> {ids.length}人{showNow ? '正在' : '近期'}讨论
                    </span>
                  )}
                  {showEditor && (
                    <span style={{ color: 'rgb(24, 144, 255)' }}>
                      <EditTwoTone /> {ids.length}人{showNow ? '正在' : '近期'}编辑
                    </span>
                  )}
                </>
              )}
            </div>
          ) : (
            <div />
          )}
          {numAvatar > 0 && (
            <div className="avatar" style={{ width: `${8 + numAvatar * 12}px` }}>
              {ids.slice(0, numAvatar).map((id, idx) => (
                <div
                  className="avatar-small"
                  key={id}
                  style={{ left: `${idx * 12}px`, zIndex: numAvatar + 1 - idx }}
                >
                  <ClientAvatar clientId={id} size={20} showTooltip={!asCard} />
                </div>
              ))}
            </div>
          )}
        </div>

        <style jsx>
          {`
            .card {
              max-width: 18rem;
              transition: all 0.2s;
              position: relative;
              background-color: rgba(255, 255, 255, 0);
              padding: 0.25rem 0.5rem;
              margin-left: -0.5rem;
              margin-bottom: 0.125rem;
              transition: all 0.2s;
              cursor: pointer;
              border-radius: 0.5rem;
            }

            .card.white {
              background-color: #fff;
              margin-bottom: 0;
              box-shadow: 0 4px 4px rgba(0, 0, 0, 0.01);
            }

            .card:hover {
              background-color: #fff;
              box-shadow: 0 4px 4px rgba(0, 0, 0, 0.01);
            }

            .second-line {
              display: flex;
              align-items: center;
              flex-wrap: nowrap;
            }

            .second-line * {
              white-space: nowrap;
            }

            .right {
              display: flex;
              align-items: center;
            }

            .stats {
              margin-left: 0.5rem;
              font-size: 12px;
              line-height: 1.2;
            }

            .avatar {
              margin-left: 0.5rem;
              display: flex;
              position: relative;
              height: 20px;
            }

            .avatar-small {
              position: absolute;
              top: 0;
              height: 20px;
              width: 20px;
              border-radius: 50%;
              box-shadow: 0 4px 4px rgba(0, 0, 0, 0.01);
            }

            .card .username {
              font-size: 12px;
              line-height: 1.2;
              color: rgba(0, 0, 0, 0.5);
            }

            .card :global(.title) {
              color: #333;
              line-height: 1.2;
              margin: 0.2rem 0;
            }
          `}
        </style>
      </div>
    </Link>
  );
};
