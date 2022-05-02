import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Tooltip, Skeleton } from 'antd';

import { ClientActions } from '@Actions';
import { getClient, getNewsroomClientRole } from '@Selectors';
import { ClientService, UtilService } from '@Services';

import { Image } from '@Components/Basic';
import { IClientAvatar } from './Avatar';
import styles from './Avatar.module.scss';

export const ClientAvatar: React.FunctionComponent<IClientAvatar.IProps> = props => {
  const [clientId, setClientId] = useState(props.clientId);
  const [eventId, setEventId] = useState(props.eventId);
  const { showRole = false } = props;
  const [role, setRole] = useState(props.role);
  const [showTooltip, setShowTooltip] = useState(
    props.showTooltip === undefined ? true : props.showTooltip
  );
  const [asLink, setAsLink] = useState(props.asLink || false);
  const [size, setSize] = useState(props.size || 32);
  const [avatar, setAvatar] = useState(props.avatar);

  useEffect(() => {
    setClientId(props.clientId);
    setEventId(props.eventId);
    setRole(props.role);
    setShowTooltip(props.showTooltip === undefined ? true : props.showTooltip);
    setAsLink(props.asLink || false);
    setSize(props.size || 32);
    setAvatar(props.avatar);
  }, [props]);

  const cn = (props as any).className;

  const client = useSelector(getClient(clientId));
  const clientRole = useSelector(getNewsroomClientRole(eventId || 0, clientId));
  const dispatch = useDispatch();

  useEffect(() => {
    if (!client) {
      dispatch(ClientActions.GetClient(clientId));
    }
  }, [client]);

  const getTooltipText = () => {
    if (!client) return <Skeleton title={false} paragraph={{ rows: 1, width: 100 }} active />;
    return (
      <span>
        {client.nickname || `@${client.username}`}
        {showRole && (role || clientRole)
          ? `：${ClientService.getRoleName(role || (clientRole as string))}`
          : ''}
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
          width={size}
          height={size}
          style={{ width: '100%', height: '100%' }}
          className={`${className} ${cn || ''} ${styles.img}`}
          src={UtilService.getImageUrl(avatarUrl, Math.max(size, 64), Math.max(size, 64))}
        />
      );
    }
    return (
      <span
        className={`${className} ${cn || ''}`}
        style={{ fontSize: `${size * 0.6}px`, lineHeight: `${size}px`, width: `${size}px` }}
      >
        {client ? (client.nickname || client.username)[0].toUpperCase() : ''}
      </span>
    );
  };

  const style = {
    style: {
      width: `${size}px`,
      height: `${size}px`,
    },
  };

  const getAvatar = () => {
    if (!asLink || !client) return getAvatarIcon();

    const goToProfilePage = (e: React.MouseEvent | React.KeyboardEvent) => {
      e.preventDefault();
      e.stopPropagation();
      UtilService.redirect(`/@${client.username}`);
    };

    return (
      <div
        role="button"
        onKeyPress={goToProfilePage}
        onClick={goToProfilePage}
        className={styles.link}
        style={style.style}
        tabIndex={0}
      >
        {getAvatarIcon(true)}
      </div>
    );
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
    <Tooltip title={getTooltipText()} overlayClassName="avatar-icon-tooltip tooltip-fit-content">
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
