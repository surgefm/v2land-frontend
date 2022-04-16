import React from 'react';
import H from 'next/head';
import { useSelector } from 'react-redux';

import { getClient } from '@Selectors';
import { UtilService } from '@Services';
import { useTranslation } from '@I18n';

import { Head } from '../Head';
import { IClientHead } from './ClientHead';

const ClientHeadComp: React.FunctionComponent<IClientHead.IProps> = ({
  title: t = '',
  clientId,
}) => {
  const { t: i18n } = useTranslation('common');
  const client = useSelector(getClient(clientId));
  if (!client) return <Head />;

  let title = `@${client.username}`;
  if (client.nickname) title += ` (${client.nickname})`;
  if (t.length > 0) title = `${title} - ${t}`;
  title += i18n('Head_Suffix');

  const description = client.description || `@${client.username} 暂无简介`;

  const list = [
    <meta key="twitter:title" name="twitter:title" content={title} />,
    <meta key="og:title" property="og:title" content={title} />,
    <meta key="description" name="description" content={description} />,
    <meta key="twitter:description" name="twitter:description" content={description} />,
    <meta key="og:description" name="og:description" content={description} />,
  ];

  if (client.avatar) {
    const imageUrl = UtilService.getImageUrl(client.avatar, 300, 300);
    list.push(<meta key="twitter:image" name="twitter:image" content={imageUrl} />);
    list.push(<meta key="og:image" property="og:image" content={imageUrl} />);
  }

  return (
    <H>
      <title>{title}</title>
      {list}
    </H>
  );
};

export const ClientHead = ClientHeadComp;
