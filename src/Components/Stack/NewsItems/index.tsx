import React from 'react';
import { INewsItems } from './NewsItems';
import { NewsItem } from '../NewsItem/index';

export const NewsItems: React.FunctionComponent<INewsItems.IProps> = ({ newsIdList }) => {
  return (
    <div className="news-area">
      <p>相关阅读</p>
      {newsIdList.map(id => (
        <NewsItem id={id} />
      ))}

      <style jsx>
        {`
          .news-area {
            margin-left: -2rem;
            margin-right: -2rem;

            padding: 1rem 2rem 2rem 2rem;

            display: flex;
            flex-direction: column;
          }

          .news-area p {
            margin-top: -1rem;
            margin-bottom: 0.3rem;
            color: rgba(73, 116, 166);
          }
        `}
      </style>
    </div>
  );
};
