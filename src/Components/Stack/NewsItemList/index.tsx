import React from 'react';
import { INewsItems } from './NewsItemList';
import { NewsItem } from '../NewsItem';

export const NewsItemList: React.FunctionComponent<INewsItems.IProps> = ({ newsIdList }) => {
  return (
    <div className="news-area">
      {newsIdList.map(id => (
        <NewsItem id={id} key={`news-${id}`} />
      ))}

      <style jsx>
        {`
          .news-area {
            padding: 0.4rem 0rem 1.25rem 0rem;
            display: flex;
            flex-direction: column;
          }
        `}
      </style>
    </div>
  );
};
