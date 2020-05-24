/* eslint-disable react/jsx-indent */
/* eslint-disable prettier/prettier */
import React from 'react';
import { useRouter } from 'next/router';
import { Space } from 'antd';

import {
  NewsroomHeaderBreadcrumb,
  NewsroomHeaderClientAvatars,
  NewsroomHeaderCommitButton,
} from '@Components/Newsroom';
import { HeaderLogo } from './Logo';
import { HeaderButton } from './Button';
import { HeaderUserInfo } from './UserInfo';

const Header: React.FunctionComponent = (): JSX.Element => {
  const router = useRouter();
  const isInNewsroom = router.route === '/[username]/[eventName]/newsroom';

  return (
    <div className="container">
      <div className="center">
        <div className="left">
          <HeaderLogo />
          <Space>
            {isInNewsroom
              ? [<NewsroomHeaderBreadcrumb />, <NewsroomHeaderClientAvatars />]
              : [
                  <HeaderButton href="/" key="/">
                    首页
                  </HeaderButton>,
                  <HeaderButton href="/about" key="/about">
                    关注
                  </HeaderButton>,
                  <HeaderButton
                    href="/[username]/[eventName]"
                    as="/1/12"
                    key="/[username]/[eventName]"
                  >
                    我的事件
                  </HeaderButton>,
                ]}
          </Space>
        </div>
        <div className="right">
          <HeaderUserInfo />
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

export { Header };
