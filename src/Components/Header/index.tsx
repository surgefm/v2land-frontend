/* eslint-disable react/jsx-indent */
/* eslint-disable prettier/prettier */
import React from 'react';
import { useRouter } from 'next/router';
import { Space } from 'antd';

import { useTranslation } from '@I18n';
import {
  NewsroomHeaderBreadcrumb,
  NewsroomHeaderClientAvatars,
  NewsroomHeaderCommitButton,
  NewsroomHeaderEnterButton,
  NewsroomHeaderSocketStatus,
} from '@Components/Newsroom';
import { EventCreateButton } from '@Components/Event';
import { HeaderLogo } from './Logo';
import { HeaderButton } from './Button';
import { HeaderUserInfo } from './UserInfo';
import { IHeader } from './Header';

const HeaderImpl: React.FC<IHeader.IProps> = (): JSX.Element => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const isInNewsroom = router.route === '/[username]/[eventName]/newsroom';
  const isHomepage = router.route.length <= 1;

  return (
    <div className="container">
      <div className="center">
        <div className="left">
          <HeaderLogo />
          <Space>
            {isInNewsroom ? (
              <>
                <NewsroomHeaderBreadcrumb />
                <NewsroomHeaderClientAvatars />
                <NewsroomHeaderSocketStatus />
              </>
            ) : (
              <>
                <HeaderButton href="/">{t('Header_Homepage')}</HeaderButton>
                <HeaderButton href="/about">{t('About_Title')}</HeaderButton>
              </>
            )}
          </Space>
        </div>
        <div className="right">
          <HeaderUserInfo />
          <NewsroomHeaderEnterButton />
          {isHomepage && <EventCreateButton />}
          {!isInNewsroom || <NewsroomHeaderCommitButton />}
        </div>
      </div>
      <style jsx>
        {`
          .container {
            width: 100%;
            height: 3.5rem;
            position: fixed;
            top: 0;
            left: 0;
            background-color: #fff;
            box-shadow: 0 4px 4px rgba(0, 0, 0, 0.075);
            display: flex;
            justify-content: center;
            z-index: 900;
          }

          .center {
            width: 100%;
            height: 100%;
            padding: 0 2rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .left,
          .right {
            height: 100%;
            display: flex;
            align-items: center;
          }
        `}
      </style>
    </div>
  );
};

export const Header = HeaderImpl;
