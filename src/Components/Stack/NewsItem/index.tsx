import React from 'react';
import { useSelector } from 'react-redux';
import { getNews } from '@Selectors';
import { INewsItem } from './NewsItem';

export const NewsItem: React.FunctionComponent<INewsItem.IProps> = ({ id }) => {
  const news = useSelector(getNews(id));
  const url = news ? news.url : '';
  return (
    <div className="news-item">
      <div className="news-link">
        <img src="/images/defaultSource.png" alt="media icon" />
        <a className="news-item" href={url}>
          {news && news.title}
        </a>
      </div>

      <div className="news-source">
        <p>{news && news.source}</p>
      </div>

      <style jsx>
        {`
          .news-item {
            max-height: 2.2rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
          }

          .news-link {
            display: flex;
            align-items: center;
          }

          img {
            height: 1.2rem;
            margin-right: 0.3rem;
          }

          a {
            color: black;
            line-height: 1.75;
            border-top: 1.5px solid transparent;
            border-bottom: 1.5px solid transparent;
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
