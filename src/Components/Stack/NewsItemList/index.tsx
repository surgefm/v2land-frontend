import React from 'react';
import { INewsItemList } from './NewsItems';
import { NewsItem } from '../NewsItem/index';

export const NewsItemList: React.FunctionComponent<INewsItemList.IProps> = ({ newsIdList }) => {
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
