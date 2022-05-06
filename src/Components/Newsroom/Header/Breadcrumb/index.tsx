import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { Breadcrumb } from 'antd';

import { useTranslation } from '@I18n';
import { getEvent, getEventId, getClientIdWithUsername, getClient } from '@Selectors';
import { LogoIcon } from '@Components/Basic';

import { INewsroomHeaderBreadcrumb } from './Breadcrumb';

const NewsroomHeaderBreadcrumbImpl: React.FC<INewsroomHeaderBreadcrumb.IProps> = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { username, eventName } = router.query as { [index: string]: string };
  const eventId = -Math.abs(useSelector(getEventId(username, eventName)));
  const event = useSelector(getEvent(eventId));
  const clientId = useSelector(getClientIdWithUsername(username));
  const client = useSelector(getClient(clientId));

  if (!client || !event) return <React.Fragment />;

  const eventPath = `${Math.abs(event.id)}-${event.pinyin}`;

  return (
    <Breadcrumb>
      <Breadcrumb.Item className="breadcrumb-logo">
        <Link href="/">
          <a>
            <LogoIcon width={(36 / 256) * 243} height={36} fill="fixed" />
          </a>
        </Link>
      </Breadcrumb.Item>
      <Breadcrumb.Item>
        <Link href="/[username]" as={`/@${client.username}`}>
          <a>{`${username}`}</a>
        </Link>
      </Breadcrumb.Item>
      <Breadcrumb.Item>
        <Link href="/[username]/[eventName]" as={`/@${client.username}/${eventPath}`}>
          <a>{event.name}</a>
        </Link>
      </Breadcrumb.Item>
      <Breadcrumb.Item>
        <Link
          href="/[username]/[eventName]/newsroom"
          as={`/@${client.username}/${eventPath}/newsroom`}
        >
          <a>{t('Newsroom_Title')}</a>
        </Link>
      </Breadcrumb.Item>

      <style jsx>
        {`
          :global(.breadcrumb-logo) {
            display: inline-block;
            height: 20px;
            position: relative;
          }

          :global(.breadcrumb-logo) :global(.anticon) {
            font-size: 20px;
          }

          :global(.ant-breadcrumb) :global(li):first-child {
            height: 20px;
          }

          :global(.ant-breadcrumb) :global(li):first-child :global(.ant-breadcrumb-separator) {
            position: relative;
            bottom: 2px;
          }
        `}
      </style>
    </Breadcrumb>
  );
};

export const NewsroomHeaderBreadcrumb = NewsroomHeaderBreadcrumbImpl;
