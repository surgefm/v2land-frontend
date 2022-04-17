/* eslint-disable react/jsx-indent */
/* eslint-disable prettier/prettier */
import React from 'react';
import { useRouter } from 'next/router';
import { Space } from 'antd';
import { QuestionCircleOutlined, HomeOutlined } from '@ant-design/icons';

import { useTranslation } from '@I18n';
import { LogoIcon } from '@Components/Basic';
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

export const Header: React.FC = (): JSX.Element => {
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
                <span className="large">
                  <NewsroomHeaderClientAvatars />
                </span>
                <NewsroomHeaderSocketStatus />
              </>
            ) : (
              <>
                <span className="large">
                  <HeaderButton href="/" Icon={HomeOutlined}>
                    {t('Header_Homepage')}
                  </HeaderButton>
                </span>
                <span className="small">
                  <HeaderButton href="/" Icon={LogoIcon}>
                    {t('Header_Homepage')}
                  </HeaderButton>
                </span>
                <HeaderButton href="/about" Icon={QuestionCircleOutlined}>
                  {t('About_Title')}
                </HeaderButton>
              </>
            )}
          </Space>
        </div>
        <div className="right">
          <HeaderUserInfo />
          <div className="large">
            <NewsroomHeaderEnterButton />
          </div>
          <div className="small fab">
            <NewsroomHeaderEnterButton />
          </div>
          {isHomepage && (
            <>
              <div className="large">
                <EventCreateButton />
              </div>
              <div className="small fab">
                <EventCreateButton />
              </div>
            </>
          )}
          {!isInNewsroom || (
            <>
              <div className="large">
                <NewsroomHeaderCommitButton />
              </div>
              <div className="small fab">
                <NewsroomHeaderCommitButton />
              </div>
            </>
          )}
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

          .fab {
            position: fixed;
            bottom: 1.5rem;
            right: 1rem;
          }

          @media (max-width: 600px) {
            .container {
              height: 3rem;
            }

            .center {
              padding: 0 0.75rem;
            }

            .large {
              display: none;
            }
          }
        `}
      </style>
    </div>
  );
};
