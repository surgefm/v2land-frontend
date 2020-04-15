// #region Global Imports
import * as React from 'react';
import Link from 'next/link';
// #endregion Global Imports

// #region Local Imports
import { Logo, LogoType } from '@Components/Basic';
import { IFooter } from './Footer';
// #endregion Local Imports

const Footer: React.FunctionComponent<IFooter.IProps> = (): JSX.Element => {
  return (
    <div className="footer">
      <div className="logo-container">
        <Link href="/">
          <a>
            <div className="logo-image">
              <Logo mode="simple" height={32} />
            </div>
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
          <a href="https://github.com/v2land" target="_blank" rel="noopener noreferrer">
            参与项目开发
          </a>
        </div>
        <div className="about-v2land">
          <a href="https://twitter.com/langchao_org" target="_blank" rel="noopener noreferrer">
            Twitter
          </a>
          <span>·</span>
          <a href="https://www.weibo.com/v2land" target="_blank" rel="noopener noreferrer">
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
          <a href="http://langchao.com" target="_blank" rel="noopener noreferrer">
            浪潮集团有限公司
          </a>
          无关
        </span>
        <span>{`Langchao.org ${new Date().getFullYear()}`}</span>
      </div>

      <style jsx>
        {`
          .footer {
            width: 100%;
            text-align: center;
            font-size: 0.75rem;
            color: #586069 !important;
            margin: 1.5rem 0 3rem 0;
            display: flex;
            flex-direction: column;
            justify-content: center;
          }

          .logo-container {
            text-align: center;
            display: flex;
            justify-content: center;
            align-items: center;
          }

          .logo-container a {
            display: inherit;
          }

          .logo-image {
            height: 2rem;
            padding-right: 0.5rem;
          }

          .content {
            display: flex;
            flex-direction: column;
            margin-top: 0.5rem;
            align-items: center;
          }

          .content * {
            line-height: 1.75;
          }

          .content span:not(:last-child) {
            margin-right: 0.25rem;
          }

          .link,
          a {
            color: #586069 !important;
            background-color: transparent !important;
            box-shadow: none !important;
            cursor: pointer;
            white-space: nowrap;
          }

          .link,
          a:not(:last-child) {
            margin-right: 0.25rem;
          }

          @media (max-width: 600px) {
            .logo-image,
            .logotype {
              height: 2rem;
            }
          }
        `}
      </style>
    </div>
  );
};

export { Footer };
