import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { Avatar, Tooltip, Skeleton } from 'antd';

import { ClientActions } from '@Actions';
import { getClient, getNewsroomClientRole } from '@Selectors';
import { ClientService, UtilService } from '@Services';

import { IClientAvatar } from './Avatar';

export const ClientAvatar: React.FunctionComponent<IClientAvatar.IProps> = (
  props = {
    clientId: 0,
    showTooltip: true,
    asLink: false,
  }
) => {
  const { clientId, eventId, role, showTooltip, asLink, avatar } = props;
  const client = useSelector(getClient(clientId));
  const clientRole = useSelector(getNewsroomClientRole(eventId || 0, clientId));
  const dispatch = useDispatch();
  const p = { ...props } as any;
  delete p.clientId;
  delete p.eventId;
  delete p.role;
  delete p.showTooltip;
  delete p.asLink;
  delete p.avatar;

  if (!client) {
    dispatch(ClientActions.GetClient(clientId));
  }

  const getTooltipText = () => {
    if (!client) return <Skeleton title={false} paragraph={{ rows: 1, width: 100 }} active />;
    return (
      <span>
        {client.nickname || `@${client.username}`}
        {role || clientRole ? `：${ClientService.getRoleName(role || (clientRole as string))}` : ''}
      </span>
    );
  };

  const getAvatarIcon = (clickable = false) => {
    if (!client) return <Skeleton.Avatar active />;
    const className = clickable ? 'clickable' : '';
    if (avatar || client.avatar) {
      const size = typeof props.size === 'number' ? props.size : 160;
      return (
        <Avatar
          {...p}
          className={className}
          src={UtilService.getImageUrl((avatar || client.avatar) as string, size, size)}
        />
      );
    }
    return (
      <Avatar {...p} className={className}>
        {(client.nickname || client.username)[0].toUpperCase()}
      </Avatar>
    );
  };

  const getAvatar = () => {
    if (!asLink || !client) return getAvatarIcon();
    return (
      <Link href="/[username]" as={`/@${client.username}`}>
        {getAvatarIcon(true)}
      </Link>
    );
  };

  if (!showTooltip) {
    return getAvatar();
  }

  return (
    <Tooltip title={getTooltipText()} overlayClassName="avatar-icon-tooltip">
      <div>
        {getAvatar()}
        <style jsx>
          {`
            :global(.avatar-icon-tooltip) :global(.ant-skeleton-paragraph) {
              margin: 0.125rem 0;
            }

            div :global(.clickable) {
              cursor: pointer;
              transition: all 0.25s;
            }

            div :global(.clickable):hover {
              box-shadow: 0 0 8px rgba(0, 0, 0, 0.2);
            }
          `}
        </style>
      </div>
    </Tooltip>
  );
};
