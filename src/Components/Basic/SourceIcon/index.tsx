import React, { useState } from 'react';
import { LinkOutlined } from '@ant-design/icons';
import { News } from '@Interfaces';
import * as UtilService from '@Services/Utils';

interface SourceIconProps {
  news: News;
  size?: number;
  translateY?: string;
}

export const SourceIcon: React.FC<SourceIconProps> = ({ news, size = 16, translateY }) => {
  const [hasError, setHasError] = useState(false);
  const iconFilename = news.site?.icon;

  if (!iconFilename || hasError) {
    return <LinkOutlined style={{ fontSize: `${size}px` }} />;
  }

  const imgStyle: React.CSSProperties = {
    objectFit: 'contain',
    borderRadius: 2,
    verticalAlign: 'middle',
    boxShadow: '0 0 1px 1px rgba(0, 0, 0, 0.1)',
    ...(translateY ? { display: 'inline-block', transform: `translateY(${translateY})` } : {}),
  };

  return (
    <img
      src={UtilService.getImageUrl(iconFilename, size, size)}
      alt={news.source || ''}
      width={size}
      height={size}
      crossOrigin="anonymous"
      onError={() => setHasError(true)}
      style={imgStyle}
      loading="eager"
      fetchPriority="high"
    />
  );
};
