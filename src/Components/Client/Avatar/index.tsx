import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Tooltip, Skeleton } from 'antd';

import { ClientActions } from '@Actions';
import { getClient, getNewsroomClientRole } from '@Selectors';
import { ClientService, UtilService } from '@Services';

import { Image } from '@Components/Basic';
import { IClientAvatar } from './Avatar';
import styles from './Avatar.module.scss';

export const ClientAvatar: React.FunctionComponent<IClientAvatar.IProps> = props => {
  const { clientId, eventId, role, showTooltip = true, asLink = false, size = 32, avatar } = props;
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
    const className = clickable ? 'clickable' : '';

    const avatarUrl = avatar || (client ? client.avatar : '');
    if (avatarUrl) {
      return (
        <Image
          alt="avatar"
          style={{ width: '100%', height: '100%' }}
          className={`${className} ${p.className || ''}`}
          src={UtilService.getImageUrl(avatarUrl, Math.max(size, 64), Math.max(size, 64))}
        />
      );
    }
    return (
      <span
        className={`${className} ${p.className || ''}`}
        style={{ fontSize: `${size * 0.6}px`, lineHeight: `${size}px`, width: `${size}px` }}
      >
        {client ? (client.nickname || client.username)[0].toUpperCase() : ''}
      </span>
    );
  };

  const getAvatar = () => {
    if (!asLink || !client) return getAvatarIcon();

    const goToProfilePage = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      UtilService.redirect(`/@${client.username}`);
    };

    return (
      <a className={styles.link} href={`/@${client.username}`} onClick={goToProfilePage}>
        {getAvatarIcon(true)}
      </a>
    );
  };

  const style = {
    style: {
      width: `${size}px`,
      height: `${size}px`,
    },
  };

  let classes = styles.container;
  if (avatar || (client ? client.avatar : null)) classes += ` ${styles.avatar}`;
  if (asLink) classes += ` ${styles.clickable}`;

  if (!showTooltip) {
    return (
      <div className={classes} {...style}>
        <div className={styles.mask} style={{ opacity: client ? 1 : 0 }}>
          {getAvatar()}
        </div>
      </div>
    );
  }

  return (
    <Tooltip title={getTooltipText()} overlayClassName="avatar-icon-tooltip">
      <div className={classes} {...style}>
        <div className={styles.mask} style={{ opacity: client ? 1 : 0 }}>
          {getAvatar()}
        </div>
        <style jsx>
          {`
            :global(.avatar-icon-tooltip) :global(.ant-skeleton-paragraph) {
              margin: 0.125rem 0;
            }
          `}
        </style>
      </div>
    </Tooltip>
  );
};
