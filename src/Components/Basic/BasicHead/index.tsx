import React from 'react';
import Head from 'next/head';

import { useTranslation } from '@I18n';

import { IBasicHead } from './BasicHead';

const BasicHeadComp: React.FunctionComponent<IBasicHead.IProps> = () => {
  const { t } = useTranslation('common');
  return (
    <Head>
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, shrink-to-fit=no, maximum-scale=1.0, user-scalable=no, viewport-fit=cover"
      />
      <link rel="manifest" href="/manifest.json" />
      <meta key="keywords" name="keywords" content={t('Head_Keywords')} />
      <meta key="description" name="description" content={t('Head_Description')} />
      <meta key="twitter:card" name="twitter:card" content="summary" />
      <meta key="twitter:site" name="twitter:site" content="@langchao_org" />
      <meta key="twitter:title" name="twitter:title" content={t('Head_Title')} />
      <meta key="twitter:description" name="twitter:description" content={t('Head_Description')} />
      <meta
        key="twitter:image"
        name="twitter:image"
        content="https://cdn.surge.fm/twitter-icon.png"
      />
      <meta key="og:title" property="og:title" content={t('Head_Title')} />
      <meta key="og:type" property="og:type" content="website" />
      <meta key="og:description" property="og:description" content={t('Head_Description')} />
      <meta key="og:image" name="og:image" content="https://cdn.surge.fm/twitter-icon.png" />
      <meta key="og:site_name" name="og:site_name" content={t('Head_Title')} />
    </Head>
  );
};

export const BasicHead = BasicHeadComp;
