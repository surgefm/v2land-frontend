// #region Global Imports
import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Space } from 'antd';
// #endregion Global Imports

import { useTranslation } from '@I18n';

// #region Local Imports
import { Logo } from '@Components/Basic';
import { IFooter } from './Footer';
// #endregion Local Imports

const FooterComp: React.FunctionComponent<IFooter.IProps> = (): JSX.Element => {
  const { t } = useTranslation('common');

  return (
    <div className="footer">
      <div className="logo-container">
        <Link href="/">

          <div className="logo-image">
            <Logo mode="simple" height={32} />
          </div>

        </Link>
      </div>
      <div className="content">
        <div className="about-v2land">
          <Link href="/about" className="link">
            {t('Footer_About')}
          </Link>
          <span>·</span>
          <a href="https://github.com/surgefm" target="_blank" rel="noopener noreferrer">
            {t('Footer_Participate')}
          </a>
        </div>
        <div className="about-v2land">
          <a href="https://twitter.com/langchao_org" target="_blank" rel="noopener noreferrer">
            {t('Share_Site_Twitter')}
          </a>
          <span>·</span>
          <a href="https://www.weibo.com/v2land" target="_blank" rel="noopener noreferrer">
            {t('Share_Site_Weibo')}
          </a>
          <span>·</span>
          <a href="https://t.me/+o5T_HxHHgYdjMTJl" target="_blank" rel="noopener noreferrer">
            {t('Share_Site_Telegram')}
          </a>
        </div>

        <span>{`Langchao.org ${new Date().getFullYear()}`}</span>

        <Space style={{ alignItems: 'center', marginTop: '1.5rem' }}>
          <span>Powered by</span>
          <a
            href="https://vercel.com/?utm_source=surgefm&utm_campaign=oss"
            target="_blank"
            rel="noreferrer"
            style={{ height: '20px', display: 'block' }}
          >
            <Image src="/images/vercel-logotype-dark.svg" height={20} width={(4438 / 1000) * 20} />
          </a>
          <a
            href="https://www.digitalocean.com/community/pages/hollies-hub-for-good"
            target="_blank"
            rel="noreferrer"
            style={{ height: '24px', display: 'block' }}
          >
            <Image src="/images/DO_Logo_icon_blue.svg" height={24} width={24} />
          </a>
        </Space>
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

export const Footer = FooterComp;
