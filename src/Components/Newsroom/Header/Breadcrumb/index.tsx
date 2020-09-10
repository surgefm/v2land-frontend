import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { Breadcrumb } from 'antd';
import { HomeOutlined } from '@ant-design/icons';

import { withTranslation } from '@I18n';
import { getEvent, getEventId, getClientIdWithUsername, getClient } from '@Selectors';

import { INewsroomHeaderBreadcrumb } from './Breadcrumb';

const NewsroomHeaderBreadcrumbImpl: React.FC<INewsroomHeaderBreadcrumb.IProps> = ({ t }) => {
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
      <Breadcrumb.Item>
        <Link href="/">
          <a>
            <HomeOutlined />
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
    </Breadcrumb>
  );
};

export const NewsroomHeaderBreadcrumb = withTranslation('common')(NewsroomHeaderBreadcrumbImpl);
