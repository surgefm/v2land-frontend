/* eslint-disable react/require-default-props */
import React, { useEffect, createRef } from 'react';
import H from 'next/head';
import getConfig from 'next/config';
import { useRouter } from 'next/router';
import { get } from '@Services/API/Http';

const {
  publicRuntimeConfig: { SITE_URL, APPLE_CLIENT_ID },
} = getConfig();

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

  const onSuccess = async (event: any) => {
    const encoded = encodeURIComponent(JSON.stringify(event.detail));
    await get(`/auth/apple/redirect${query}&res=${encoded}`);
    window.location.href = `${SITE_URL}${redirectTo as string}`;
  };

  useEffect(() => {
    if (!ref.current) return () => {};
    (window as any).AppleLoginWidget = {};

    const script = document.createElement('script');
    script.src =
      'https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js';
    script.async = true;
    ref.current.appendChild(script);

    document.addEventListener('AppleIDSignInOnSuccess', onSuccess);

    return () => {
      document.removeEventListener('AppleIDSignInOnSuccess', onSuccess);
    };
  }, []);

  return (
    <div>
      <div
        id="appleid-signin"
        data-color="white"
        data-border="true"
        data-type="sign in"
        data-border-radius="50"
        data-height="30"
        data-width="150"
        className="signin-button"
      />
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
