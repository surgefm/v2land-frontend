// #region Global Imports
import * as React from 'react';
import Link from 'next/link';
// #endregion Global Imports

// #region Local Imports
import { Logo, LogoType } from '@Components/Basic';
import { IFooter } from './Footer';
import './Footer.scss';
// #endregion Local Imports

const Footer: React.FunctionComponent<IFooter.IProps> = (): JSX.Element => {
  return (
    <div className="footer">
      <div className="logo-container">
        <Link href="/">
          <a href="/">
            <Logo className="logo-image" mode="simple" />
            <LogoType color="#0083a8" height={32} className="logotype" />
          </a>
        </Link>
      </div>
      <div className="content">
        <div className="about-v2land">
          <Link href="/about">
            <a className="link">关于浪潮</a>
          </Link>
          <span>·</span>
          <a
            href="https://github.com/v2land"
            target="_blank"
            rel="noopener noreferrer"
          >
            参与项目开发
          </a>
        </div>
        <div className="about-v2land">
          <a
            href="https://twitter.com/langchao_org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Twitter
          </a>
          <span>·</span>
          <a
            href="https://www.weibo.com/v2land"
            target="_blank"
            rel="noopener noreferrer"
          >
            微博
          </a>
          <span>·</span>
          <a
            href="https://t.me/joinchat/AwWDRE3b5ZasxWROvz4y7w"
            target="_blank"
            rel="noopener noreferrer"
          >
            Telegram 交流群
          </a>
        </div>
        <span>
          本站与
          <a
            href="http://langchao.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            浪潮集团有限公司
          </a>
          无关
        </span>
        <span>{`Langchao.org ${new Date().getFullYear()}`}</span>
      </div>
    </div>
  );
};

export { Footer };
