import React, { useState, useEffect } from 'react';
import { Button, Space, Modal, Spin, message } from 'antd';
import { BellTwoTone, BellOutlined } from '@ant-design/icons';
import getConfig from 'next/config';

import { RedstoneService } from '@Services';
import { IEventSubscribe } from './Subscribe';

const {
  publicRuntimeConfig: { VAPID_PUBLIC_KEY },
} = getConfig();

export const EventSubscribe: React.FunctionComponent<IEventSubscribe.IProps> = ({ eventId }) => {
  const getHasSubscribed = () =>
    typeof localStorage === 'undefined'
      ? false
      : localStorage.getItem(`event-${eventId}-subscribed`) === 'true' &&
        Notification.permission === 'granted';
  const [hasSubscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const iconStyle = { fontSize: '1.5rem', color: '#9f5afd' };

  useEffect(() => {
    setSubscribed(getHasSubscribed());
  });

  const subscribe = async () => {
    if (typeof localStorage === 'undefined') return;
    if (loading) return;
    if (hasSubscribed) {
      message.info('取消关注功能正在开发中');
      return;
    }

    const ua = navigator.userAgent.toLowerCase();
    if (ua.indexOf('android') > -1) {
      message.info('安卓关注功能正在开发中');
      return;
    }

    let displayMode = 'browser';
    const mqStandAlone = '(display-mode: standalone)';
    if ((navigator as any).standalone || window.matchMedia(mqStandAlone).matches) {
      displayMode = 'standalone';
    }
    if (typeof Notification === 'undefined' && displayMode === 'browser') {
      setShowModal(true);
      return;
    }

    if (Notification.permission !== 'granted') {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') return;
    }
    setLoading(true);
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: VAPID_PUBLIC_KEY,
    });

    await RedstoneService.subscribeEvent(eventId, JSON.stringify(subscription));
    message.success('关注成功');
    localStorage.setItem(`event-${eventId}-subscribed`, 'true');
    setSubscribed(true);
    setLoading(false);
  };

  let icon = hasSubscribed ? (
    <BellTwoTone style={iconStyle} twoToneColor="#9f5afd" />
  ) : (
    <BellOutlined style={iconStyle} />
  );
  if (loading) icon = <Spin style={{ paddingTop: '.25rem' }} />;

  return (
    <div className="container">
      <Space size={0}>
        <Button size="large" type="link" onClick={subscribe} icon={icon} />
      </Space>

      <Modal
        title="订阅说明"
        visible={showModal}
        onCancel={() => setShowModal(false)}
        footer={null}
      >
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <img src="/images/ios_pwa_guide.jpg" width={290} height={407} alt="订阅说明" />
        </div>
      </Modal>

      <style jsx>
        {`
          .container {
            padding-top: 0.25rem;
            padding-left: 0;
            transform: translateX(0.5rem);
            float: right;
            display: inline-flex;
            flex-direction: column;
            align-items: center;
          }

          .container span {
            font-size: 1rem;
            font-family: 'Lexend Giga', sans-serif;
            color: rgba(0, 0, 0, 0.45);
          }

          :global(.generating-screenshot) .container {
            padding-top: 0;
            margin-top: -0.1rem;
            margin-bottom: -0.35rem;
            margin-left: -0.25rem;
            transform: translateX(0.5rem) translateY(-0.1rem);
          }

          @media (max-width: 600px) {
            .container {
              padding-top: 0;
              margin-top: -0.1rem;
              margin-bottom: -0.35rem;
              margin-left: -0.25rem;
              transform: translateX(0.5rem) translateY(-0.1rem);
            }
          }
        `}
      </style>
    </div>
  );
};
