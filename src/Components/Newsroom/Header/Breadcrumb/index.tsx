import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { Breadcrumb } from 'antd';
import { HomeOutlined } from '@ant-design/icons';

import { getEvent } from '@Selectors';

export const NewsroomHeaderBreadcrumb: React.FunctionComponent = () => {
  const router = useRouter();
  const { username, eventName } = router.query;
  const event = useSelector(getEvent(-eventName));

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
        <Link href="/[username]" as={`/${username}`}>
          <a>{`${username}`}</a>
        </Link>
      </Breadcrumb.Item>
      <Breadcrumb.Item>
        <Link href="/[username]/[eventName]" as={`/${username}/${eventName}`}>
          <a>{event.name}</a>
        </Link>
      </Breadcrumb.Item>
      <Breadcrumb.Item>
        <Link href="/[username]/[eventName]/newsroom" as={`/${username}/${eventName}/newsroom`}>
          <a>新闻编辑室</a>
        </Link>
      </Breadcrumb.Item>
    </Breadcrumb>
  );
};
