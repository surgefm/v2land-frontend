/* eslint-disable react/require-default-props */
import React, { useEffect, createRef } from 'react';

type TelegramLoginButtonProps = {
  botName: string;
  buttonSize: 'large' | 'medium' | 'small';
  cornerRadius?: number;
  requestAccess: string;
  usePic?: boolean;
  onAuth?: Function;
  onAuthUrl?: string;
  lang?: string;
  widgetVersion?: number;
  className?: string;
};

export const TelegramLoginButton: React.FC<TelegramLoginButtonProps> = props => {
  const ref = createRef<HTMLDivElement>();

  const {
    botName = 'langchao_bot',
    buttonSize = 'medium',
    cornerRadius,
    requestAccess,
    usePic = true,
    onAuth,
    onAuthUrl,
    lang = 'en',
    widgetVersion = 19,
    className,
  } = props;

  useEffect(() => {
    if (!ref.current) return;
    (window as any).TelegramLoginWidget = {
      dataOnauth: onAuth,
    };

    const script = document.createElement('script');
    script.src = `https://telegram.org/js/telegram-widget.js?${widgetVersion}`;
    script.setAttribute('data-telegram-login', botName);
    script.setAttribute('data-size', buttonSize);
    if (cornerRadius !== undefined) {
      script.setAttribute('data-radius', `${cornerRadius}`);
    }
    script.setAttribute('data-request-access', requestAccess);
    if (!usePic) {
      script.setAttribute('data-userpic', 'false');
    }
    script.setAttribute('data-lang', lang);
    if (onAuthUrl !== undefined) {
      script.setAttribute('data-auth-url', onAuthUrl);
    } else {
      script.setAttribute('data-onauth', 'TelegramLoginWidget.dataOnauth(user)');
    }
    script.async = true;
    ref.current.appendChild(script);
  }, []);

  return <div className={className} ref={ref} />;
};

export default TelegramLoginButton;
