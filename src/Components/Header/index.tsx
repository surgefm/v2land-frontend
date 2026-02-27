/* eslint-disable react/jsx-indent */
/* eslint-disable prettier/prettier */
import React, { useEffect, useState, createRef, LegacyRef } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { Space } from 'antd';
import { QuestionCircleOutlined, HomeOutlined, NumberOutlined } from '@ant-design/icons';

import { useTranslation } from '@I18n';
import { LogoIcon } from '@Components/Basic';
import {
  NewsroomHeaderBreadcrumb,
  NewsroomHeaderClientAvatars,
  NewsroomHeaderCommitButton,
  NewsroomHeaderEnterButton,
  NewsroomHeaderReviewButton,
  NewsroomHeaderSocketStatus,
} from '@Components/Newsroom';
import { EventCreateButton } from '@Components/Event';
import { getEventId, getEvent, canCurrentClientViewEvent } from '@Selectors';
import { HeaderLogo } from './Logo';
import { HeaderButton } from './Button';
import { HeaderUserInfo } from './UserInfo';
import { HeaderTagManage } from './TagManage';
import { HeaderSearchBox } from './SearchBox';

export const Header: React.FC = (): JSX.Element => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const leftRef: LegacyRef<HTMLDivElement> = createRef();
  const rightRef: LegacyRef<HTMLDivElement> = createRef();
  const eventId = useSelector(
    getEventId(router.query.username as string, router.query.eventName as string)
  );
  const event = useSelector(getEvent(eventId));
  const canView = useSelector(canCurrentClientViewEvent(eventId));

  const isInNewsroom = router.route === '/[username]/[eventName]/newsroom';
  const isInReview = router.route === '/[username]/[eventName]/review';
  const isInNewsroomContext = isInNewsroom || isInReview;
  const isInTagPage = router.route === '/topic/[tagId]';
  const isInTagListPage = router.route === '/topic';
  const isInWikiPage = router.route === '/wiki';
  const isInAboutPage = router.route === '/about';
  const isHomepage = router.route.length <= 1;
  const isInEventPage = router.route === '/[username]/[eventName]';
  const isInProfilePage = ['/[username]', '/[username]/star'].includes(router.route);
  const showSearchBox = isHomepage || isInTagPage || isInEventPage || isInTagListPage
    || isInWikiPage || isInAboutPage || isInProfilePage;

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
    <div className="super">
      <div className="container">
        <div className="center">
          <div className="left" style={{ paddingRight: 4 + rightWidth }} ref={leftRef}>
            {!isInNewsroomContext && <span className="large"><HeaderLogo /></span>}
            {isInNewsroomContext ? (
              <Space size={4}>
                <NewsroomHeaderBreadcrumb />
                <span className="large">
                  <NewsroomHeaderClientAvatars />
                </span>
                <NewsroomHeaderSocketStatus />
              </Space>
            ) : (
              <div className="nav-items">
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
                <HeaderButton
                  href="/topic"
                  Icon={() => (
                    <NumberOutlined
                      style={{
                        transform: 'skewX(-10deg)',
                        fontSize: 20,
                        position: 'relative',
                        top: 2,
                        marginRight: 8
                      }}
                    />
                  )}
                >
                  话题
                </HeaderButton>
                <HeaderButton href="/wiki" Icon={QuestionCircleOutlined}>
                  指南
                </HeaderButton>
                {showSearchBox && (
                  <div className="search-wrapper">
                    <HeaderSearchBox />
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="right" ref={rightRef}>
            {isInTagPage && <HeaderTagManage />}
            <HeaderUserInfo />
            <div className="large">
              <NewsroomHeaderEnterButton />
            </div>
            {isHomepage && (
              <div className="large">
                <EventCreateButton />
              </div>
            )}
            {!isInNewsroomContext || (
              <div className="large">
                <NewsroomHeaderReviewButton />
                <NewsroomHeaderCommitButton />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="small fab">
        <NewsroomHeaderEnterButton />
      </div>

      {isHomepage && (
        <div className="small fab">
          <EventCreateButton />
        </div>
      )}

      {!isInNewsroomContext || (
        <div className="small fab">
          <NewsroomHeaderCommitButton />
        </div>
      )}

      <style jsx>
        {`
          .super {
            position: absolute;
            left: 0;
            top: 0;
            z-index: 201;
          }

          .container {
            width: 100%;
            height: 3.5rem;
            position: fixed;
            top: 0;
            left: 0;
            background-color: #fff;
            border-bottom: 1px solid rgba(0, 0, 0, 0.05);
            box-shadow: 0 4px 4px rgba(0, 0, 0, 0.01);
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
            flex: 1;
            min-width: 0;
            padding-left: 2rem;
            padding-right: 6rem;
            overflow: hidden;
          }

          .nav-items {
            display: flex;
            align-items: center;
            gap: 4px;
            flex: 1;
            min-width: 0;
          }

          .search-wrapper {
            flex: 1;
            min-width: 0;
            overflow: hidden;
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
            left: initial;
            display: none;
            width: min-content;
            z-index: 1;
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

            .fab {
              display: block;
            }
          }
        `}
      </style>
    </div>
  );
};
