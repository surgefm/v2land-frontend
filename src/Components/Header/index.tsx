import React from 'react';

import { HeaderLogo } from './Logo';
import { HeaderButton } from './Button';
import { HeaderUserInfo } from './UserInfo';

const Header: React.FunctionComponent = (): JSX.Element => {
  return (
    <div className="container">
      <div className="center">
        <div className="left">
          <HeaderLogo />
          <HeaderButton href="/">首页</HeaderButton>
          <HeaderButton href="/about">关注</HeaderButton>
          <HeaderButton href="/[username]/[eventName]" as="/1/12">
            我的事件
          </HeaderButton>
        </div>
        <div className="right">
          <HeaderUserInfo />
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
            z-index: 100000;
          }

          .center {
            width: 100%;
            height: 100%;
            max-width: 50rem;
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
