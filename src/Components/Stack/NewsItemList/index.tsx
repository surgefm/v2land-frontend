import React, { useState } from 'react';
import { Button } from 'antd';
import { DownCircleOutlined, UpCircleOutlined } from '@ant-design/icons';

import { withTranslation } from '@I18n';

import { INewsItemList } from './NewsItems';
import { NewsItem } from '../NewsItem/index';

const NewsItemListImpl: React.FunctionComponent<INewsItemList.IProps> = ({ newsIdList, t }) => {
  const [showMore, setShowMore] = useState(false);

  let newsItems: React.ReactElement[] = [];
  if (newsIdList.length <= 3) {
    newsItems = newsIdList.map(id => <NewsItem id={id} key={`news-${id}`} />);
  } else {
    for (let i = 0; i < (showMore ? newsIdList.length : 3); i += 1) {
      const id = newsIdList[i];
      newsItems.push(<NewsItem id={id} key={`news-${id}`} />);
    }
    const toggleShowMore = () => setShowMore(!showMore);
    newsItems.push(
      <Button
        type="link"
        size="small"
        key="toggle-button"
        onClick={toggleShowMore}
        icon={showMore ? <UpCircleOutlined /> : <DownCircleOutlined />}
      >
        {showMore ? t('Stack_Card_CollapseMoreNews') : t('Stack_Card_ShowMoreNews')}
      </Button>
    );
  }

  return (
    <div className="news-area">
      {newsItems}

      <style jsx>
        {`
          .news-area {
            padding: 0.4rem 0rem 0.5rem 0rem;
            display: flex;
            flex-direction: column;
          }
        `}
      </style>
    </div>
  );
};

export const NewsItemList = withTranslation('common')(NewsItemListImpl);
