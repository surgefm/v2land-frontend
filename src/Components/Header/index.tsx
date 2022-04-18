/* eslint-disable react/jsx-indent */
/* eslint-disable prettier/prettier */
import React, { useEffect, useState, createRef, LegacyRef } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
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
import { getEventId, getEvent, canCurrentClientViewEvent } from '@Selectors';
import { HeaderLogo } from './Logo';
import { HeaderButton } from './Button';
import { HeaderUserInfo } from './UserInfo';

export const Header: React.FC = (): JSX.Element => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const rightRef: LegacyRef<HTMLDivElement> = createRef();
  const eventId = useSelector(
    getEventId(router.query.username as string, router.query.eventName as string)
  );
  const event = useSelector(getEvent(eventId));
  const canView = useSelector(canCurrentClientViewEvent(eventId));

  const isInNewsroom = router.route === '/[username]/[eventName]/newsroom';
  const isHomepage = router.route.length <= 1;
  const [rightWidth, setRightWidth] = useState(32);

  const updateRightWidth = () => {
    if (!rightRef.current) return;
    setRightWidth(rightRef.current.offsetWidth);
  }

  useEffect(() => {
    updateRightWidth();

    window.removeEventListener('resize', updateRightWidth);
    window.addEventListener('resize', updateRightWidth);

    return () => {
      window.removeEventListener('resize', updateRightWidth);
    };
  });

  useEffect(() => {
    updateRightWidth();
  }, [router, event, canView]);

  return (
    <div className="container">
      <div className="center">
        <div className="left" style={{ paddingRight: 4 + rightWidth }}>
          <HeaderLogo />
          <Space size={0}>
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
                {/* <HeaderButton href="/tags" Icon={NumberOutlined}>
                  热门话题
                </HeaderButton> */}
                <HeaderButton href="/about" Icon={QuestionCircleOutlined}>
                  {t('About_Title')}
                </HeaderButton>
              </>
            )}
          </Space>
        </div>
        <div className="right" ref={rightRef}>
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
            padding: 0;
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

          .left {
            padding-left: 2rem;
            padding-right: 6rem;
            overflow-x: scroll;
            scroll-behavior: smooth;
          }

          .left::-webkit-scrollbar {
            display: none;
          }

          .right {
            padding-right: 2rem;
            position: absolute;
            right: 0;
            background-color: #fff;
          }

          .fab {
            position: fixed;
            bottom: 1.5rem;
            right: 1rem;
          }

          @media (max-width: 700px) {
            .container {
              height: 3rem;
            }

            .left {
              padding-left: 0.75rem;
              padding-right: 3.5rem;
              gap: 4px;
            }

            .right {
              padding-right: 0.75rem;
            }
          }
        `}
      </style>
    </div>
  );
};
