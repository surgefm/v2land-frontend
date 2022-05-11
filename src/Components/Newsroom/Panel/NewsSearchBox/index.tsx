import React, { useState } from 'react';
import getConfig from 'next/config';
import algoliasearch from 'algoliasearch/lite';
import { Input, AutoComplete, Typography, Button, Divider, Modal } from 'antd';
import {
  SearchOutlined,
  FormOutlined,
  BugOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';

import { News } from '@Interfaces';
import { UtilService, getNewsroomSocket } from '@Services';
import { EventActions, NewsActions } from '@Actions';
import { useTranslation } from '@I18n';
import { get } from '@Services/API/Http';
import { NewsForm } from '@Components/News';
import { getActiveNewsroomId } from '@Selectors';

const {
  publicRuntimeConfig: { ALGOLIA_ID, ALGOLIA_KEY },
} = getConfig();

const searchClient = ALGOLIA_ID && ALGOLIA_KEY ? algoliasearch(ALGOLIA_ID, ALGOLIA_KEY) : null;

let searchTimer: number;

const getNewsOption = (news: News) => ({
  value: news.id,
  label: (
    <p style={{ margin: 0 }}>
      <span style={{ color: 'rgba(0, 0, 0, .3)' }}>
        {news.source || new URL(news.url).hostname.replace('www.', '')}
      </span>
      <Typography.Paragraph ellipsis style={{ margin: 0 }}>
        {news.title}
      </Typography.Paragraph>
      <Typography.Text style={{ color: 'rgba(0, 0, 0, .3)', fontSize: '11px' }} ellipsis>
        {news.url}
      </Typography.Text>
    </p>
  ),
});

type QueueItemType = {
  url: string;
  metadata?: News;
  failed?: boolean;
};

export const NewsroomPanelNewsSearchBox = ({
  eventId,
  newsIdList = [],
}: {
  eventId: number;
  newsIdList: number[];
}) => {
  const dispatch = useDispatch();
  const [input, setInput] = useState('');
  const [queue, setQueue] = useState<QueueItemType[]>([]);
  const [results, setResults] = useState<News[]>([]);
  const [newNewsVisible, setNewNewsVisible] = useState(false);
  const newsroomId = useSelector(getActiveNewsroomId);
  const { t } = useTranslation('common');
  const newsIds = newsIdList.map(id => Math.abs(id));

  const search = (text: string) => {
    if (!searchClient) return;
    clearTimeout(searchTimer);

    searchTimer = setTimeout(async () => {
      const { hits } = await searchClient.initIndex('news').search(text, {
        hitsPerPage: 50,
        filters: newsIds.map(id => `NOT objectID:${id}`).join(' AND '),
      });

      setResults((hits as any) as News[]);
    });
  };

  const onChange = (text: string) => {
    setInput(text);
    if (text.length === 0) {
      setResults([]);
    } else {
      search(text);
    }
  };

  const handleNewNewsOk = () => setNewNewsVisible(false);
  const handleNewNewsCancel = () => setNewNewsVisible(false);

  const crawlUrl = async (url: string) => {
    const u = url.trim();
    if (queue.find(q => q.url === u)) return;

    setQueue([{ url: u }, ...queue]);
    let data: QueueItemType;
    try {
      const res = await get<any>('/extract', { url: u });
      if (res.result.time) res.result.time = moment(res.result.time);
      if (res.result.source.startsWith('www.')) res.result.source = res.result.source.slice(4);
      data = { url: u, metadata: res.result };
    } catch (err) {
      data = {
        url: u,
        failed: true,
      };
    }

    setQueue((prev = []) => {
      const idx = prev.findIndex(q => q.url === u);
      if (idx < 0) {
        return [data, ...prev];
      }
      return [...prev.slice(0, idx), data, ...prev.slice(idx + 1)];
    });
  };

  let options: any[] = [];
  if (UtilService.isValidHttpUrl(input)) {
    options = [
      {
        value: '[[CRAWL URL]]',
        label: (
          <span>
            <BugOutlined rotate={-45} style={{ marginRight: '0.25rem' }} />
            自动抓取网页信息
          </span>
        ),
      },
      {
        value: '[[MANUAL ADDITION]]',
        label: (
          <span>
            <FormOutlined style={{ marginRight: '0.25rem' }} />
            手动添加新闻
          </span>
        ),
      },
    ];
  }

  options = [...options, ...results.map(getNewsOption)];

  const onSelect = async (value: string | number) => {
    setInput('');
    if (value === '[[CRAWL URL]]' && UtilService.isValidHttpUrl(input)) {
      crawlUrl(input);
    } else if (value === '[[MANUAL ADDITION]]') {
      setNewNewsVisible(true);
    } else if (typeof value === 'number') {
      const news = results.find(r => r.id === value);
      if (!news) return;
      news.id = -news.id;

      const socket = getNewsroomSocket(newsroomId);
      if (socket) {
        await socket.addNewsToEvent(Math.abs(value));
      }

      dispatch(NewsActions.AddNews(news));
      dispatch(
        EventActions.AddNewsToEventOffshelfNewsList(-Math.abs(newsroomId), -Math.abs(news.id))
      );
    }
  };

  const QueueItem = ({ item }: { item: QueueItemType }) => {
    const [visible, setVisible] = useState(false);
    const handleOk = () => {
      setQueue(queue.filter(q => q.url !== item.url));
      setVisible(false);
    };
    const handleCancel = () => setVisible(false);

    return (
      <>
        <div className="container">
          <Typography.Text
            ellipsis={{ tooltip: item.url }}
            style={{ color: 'rgba(0, 0, 0, 0.65)' }}
          >
            {item.failed ? (
              <ExclamationCircleOutlined style={{ marginRight: '.3rem', paddingLeft: '.1rem' }} />
            ) : (
              <BugOutlined rotate={-45} style={{ marginRight: '.3rem' }} />
            )}
            {item.url}
          </Typography.Text>
          <div className="buttons">
            {item.failed && <span>抓取失败</span>}
            {(item.failed || item.metadata) && (
              <Button type="primary" size="small" onClick={() => setVisible(true)}>
                完成添加
                <FormOutlined />
              </Button>
            )}
            {!item.failed && !item.metadata && (
              <Button size="small" loading disabled>
                加载中
              </Button>
            )}
          </div>
          <style jsx>
            {`
              .container {
                display: flex;
                align-items: center;
                justify-content: space-between;
                width: 100%;
                padding: 0.2rem 0.4rem;
                margin-top: 0.5rem;
                background-color: rgb(232, 232, 232);
                border-radius: 0.25rem;
              }

              .buttons {
                display: flex;
                align-items: center;
              }

              .buttons span {
                white-space: nowrap;
                margin-right: 0.5rem;
              }
            `}
          </style>
        </div>

        <Modal
          title={t('Newsroom_AddNews')}
          visible={visible}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={null}
        >
          <NewsForm
            eventId={eventId}
            initialValues={item.metadata}
            onOk={handleOk}
            onCancel={handleCancel}
          />
        </Modal>
      </>
    );
  };

  return (
    <div className="container">
      <AutoComplete value={input} onChange={onChange} options={options} onSelect={onSelect}>
        <Input
          suffix={<SearchOutlined style={{ color: 'rgba(0, 0, 0, .3)' }} />}
          placeholder="输入关键词或链接以添加新闻…"
          onPressEnter={() => onSelect('[[CRAWL URL]]')}
          style={{ borderRadius: '.25rem' }}
          allowClear
        />
      </AutoComplete>
      {queue.map(q => (
        <QueueItem item={q} key={q.url} />
      ))}
      {queue.length > 0 && <Divider style={{ margin: '.5rem 0 0' }} />}
      <Modal
        title={t('Newsroom_AddNews')}
        visible={newNewsVisible}
        onOk={handleNewNewsOk}
        onCancel={handleNewNewsCancel}
        footer={null}
      >
        <NewsForm
          eventId={eventId}
          onOk={handleNewNewsOk}
          onCancel={handleNewNewsCancel}
          initialValues={
            {
              url: input,
            } as any
          }
        />
      </Modal>
      <style jsx>
        {`
          .container {
            display: flex;
            flex-direction: column;
            width: 100%;
            padding: 0.5rem 0.5rem 0;
          }
        `}
      </style>
    </div>
  );
};
