/* eslint-disable prettier/prettier */
import React from 'react';
import getConfig from 'next/config';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { get } from '@Services/API/Http';
import { Button, Space, Tooltip } from 'antd';
import { TwitterOutlined } from '@ant-design/icons';
import { TelegramLoginButton } from './TelegramLoginButton';
import { AppleLoginButton } from './AppleLoginButton';

const {
  publicRuntimeConfig: { API_URL, SITE_URL },
} = getConfig();

export const SSOButtons = () => {
  const router = useRouter();
  const inviteCode = router.query.r || '';
  const redirectTo = router.query.redirect || '/';
  const redirect = `${SITE_URL}/sso?redirect=${encodeURIComponent(`${redirectTo}`)}`;
  const query = `?redirect=${encodeURIComponent(redirect)}&inviteCode=${inviteCode}`;

  const onClick = (site: string) => () => {
    window.location.href = `${API_URL}/auth/${site}${query}`;
  };

  const handleTelegramResponse = async (response: any) => {
    const encoded = encodeURIComponent(JSON.stringify(response));
    await get(`/auth/telegram/redirect${query}&res=${encoded}`);
    window.location.href = `${SITE_URL}/${redirectTo as string}`;
  }

  return (
    <Space align="start">
      <span style={{ lineHeight: '2.5rem', textAlign: 'center', whiteSpace: 'nowrap' }}>第三方平台：</span>
      <Space direction="vertical">
        <Space>
          <Tooltip title="Twitter 登录" placement="bottom">
            <Button
              type="primary"
              shape="circle"
              icon={<TwitterOutlined style={{ fontSize: 25, color: '#1DA1F2' }} />}
              size="large"
              style={{ backgroundColor: '#fff', borderColor: '#1DA1F2' }}
              onClick={onClick('twitter')}
            />
          </Tooltip>
          <Tooltip title="微博登录" placement="bottom">
            <Button
              type="primary"
              shape="circle"
              icon={<Image src="/images/Sina_Weibo.svg" width={26} height={(26 / 724.7) * 587.1} />}
              size="large"
              style={{
              backgroundColor: '#fff',
              borderColor: 'rgb(255, 89, 0)',
              display: 'inline-flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
              onClick={onClick('weibo')}
            />
          </Tooltip>
          <Tooltip title="用 Google 账号登录" placement="bottom">
            <Button
              type="primary"
              shape="circle"
              icon={(
                <Image
                  src="/images/google.svg"
                  width={23}
                  height={(23 / 18) * 19}
                  style={{ transform: 'translateY(1px)' }}
                />
            )}
              size="large"
              style={{
              backgroundColor: '#fff',
              borderColor: '#4285F4',
              display: 'inline-flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
              onClick={onClick('google')}
            />
          </Tooltip>
        </Space>
        <Space style={{ minHeight: '2.5rem' }} align="start" wrap>
          <AppleLoginButton state={redirect} />
          <TelegramLoginButton
            botName="langchao_bot"
            buttonSize="medium"
            onAuth={handleTelegramResponse}
            requestAccess="write"
            widgetVersion={19}
            usePic
          />
        </Space>
      </Space>
    </Space>
  );
};
