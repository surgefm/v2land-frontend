import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Button } from 'antd';
import { DownCircleOutlined, UpCircleOutlined } from '@ant-design/icons';

import { useTranslation } from '@I18n';
import { isGeneratingScreenshot } from '@Selectors';

import { INewsItemList } from './NewsItems';
import { NewsItem } from '../NewsItem/index';

const NewsItemListImpl: React.FunctionComponent<INewsItemList.IProps> = ({ newsIdList }) => {
  const { t } = useTranslation('common');
  const [showMore, setShowMore] = useState(false);
  const generatingScreenshot = useSelector(isGeneratingScreenshot);

  let newsItems: React.ReactElement[] = [];
  if (newsIdList.length <= 3 || generatingScreenshot) {
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

export const NewsItemList = NewsItemListImpl;
