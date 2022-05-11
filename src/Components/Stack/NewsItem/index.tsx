import React from 'react';
import { useSelector } from 'react-redux';
import { LinkOutlined } from '@ant-design/icons';

import { getNews } from '@Selectors';

import { INewsItem } from './NewsItem';

export const NewsItem: React.FunctionComponent<INewsItem.IProps> = ({ id }) => {
  const news = useSelector(getNews(id));
  const url = news ? news.url : '';
  return (
    <div className="news-item">
      <div className="news-link">
        <div className="img">
          <LinkOutlined style={{ fontSize: '1rem' }} />
        </div>
        <a href={url} target="_blank" rel="noreferrer">
          {news && news.title}
        </a>
      </div>

      <div className="news-source">
        {news && news.source && <p>{news.source}</p>}
        {news && !news.source && <p>{new URL(news.url).hostname.replace('www.', '')}</p>}
      </div>

      <style jsx>
        {`
          .news-item {
            max-height: 2.2rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            position: relative;
            overflow: hidden;
          }

          .news-link {
            display: flex;
            align-items: center;
            flex-grow: 1;
          }

          .news-item .img {
            height: 1rem;
            width: 1rem;
            margin-right: 0.3rem;
            display: flex;
            justify-content: center;
            align-items: center;
          }

          .news-source {
            position: absolute;
            right: 0;
            line-height: 2rem;
            padding-left: 1.5rem;
            background: #fff;
            background: linear-gradient(to right, rgba(255, 255, 255, 0), #fff 1rem, #fff 100%);
            white-space: nowrap;
          }

          a {
            color: black;
            line-height: 1.75;
            border-top: 1.5px solid transparent;
            border-bottom: 1.5px solid transparent;
            white-space: nowrap;
          }

          a:hover {
            text-decoration: none !important;
            border-bottom-color: #333;
          }

          p {
            margin: 0;
            font-size: 0.9rem;
            color: gray;
          }
        `}
      </style>
    </div>
  );
};
