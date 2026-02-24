/* eslint-disable prettier/prettier */
/* eslint-disable react/require-default-props */
import React, { useEffect, createRef } from 'react';
import H from 'next/head';

import { useRouter } from 'next/router';
import { Button, Tooltip } from 'antd';
import { AppleFilled } from '@ant-design/icons';

import { get } from '@Services/API/Http';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;
const APPLE_CLIENT_ID = process.env.NEXT_PUBLIC_APPLE_CLIENT_ID;

type AppleLoginButtonProps = {
  state?: string;
};

export const AppleLoginButton: React.FC<AppleLoginButtonProps> = ({ state }) => {
  const ref = createRef<HTMLDivElement>();
  const router = useRouter();
  const inviteCode = router.query.r || '';
  const query = `?inviteCode=${inviteCode}`;
  const redirectTo = router.query.redirect || '/';

  const redirectUri = `${SITE_URL}/api/auth/apple`;

  const signIn = async () => {
    const response = await (window as any).AppleID.auth.signIn();

    const encoded = encodeURIComponent(JSON.stringify(response));
    await get(`/auth/apple/redirect${query}&res=${encoded}`);
    window.location.href = `${SITE_URL}${redirectTo as string}`;
  
    return response;
  }

  useEffect(() => {
    if (!ref.current) return;
    (window as any).AppleLoginWidget = {};

    const script = document.createElement('script');
    script.src =
      'https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js';
    script.async = true;
    ref.current.appendChild(script);
  }, []);

  return (
    <div>
      <Tooltip title="通过 Apple 登录" placement="bottom">
        <Button
          type="primary"
          shape="circle"
          icon={(
            <AppleFilled
              style={{ color: '#333', fontSize: '1.4rem', transform: 'translate(-0.5px, -1px)' }}
            />
          )}
          size="large"
          style={{
            backgroundColor: '#fff',
            borderColor: '#000',
            display: 'inline-flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onClick={signIn}
        />
      </Tooltip>

      <div ref={ref} />
      <H>
        <meta name="appleid-signin-client-id" content={APPLE_CLIENT_ID} />
        <meta name="appleid-signin-redirect-uri" content={redirectUri} />
        <meta name="appleid-signin-scope" content="name email" />
        <meta name="appleid-signin-state" content={state} />
        <meta name="appleid-signin-nonce" content={state} />
        <meta name="appleid-signin-use-popup" content="true" />
      </H>

      <style jsx>
        {`
          .signin-button {
            height: 30px;
            cursor: pointer;
            transform-origin: top left;
            transform: scale(0.93333);
            width: calc(150px * 0.93333);
          }
        `}
      </style>
    </div>
  );
};

export default AppleLoginButton;
