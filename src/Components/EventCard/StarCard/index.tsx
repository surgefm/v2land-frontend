import React from 'react';
import { Tag } from 'antd';
import { StarOutlined } from '@ant-design/icons';

import { IStarCard } from './StarCard';

const StarCard: React.FunctionComponent<IStarCard.IProps> = ({ starCount }) => {
  return (
    <Tag color="gold" icon={<StarOutlined />}>
      {starCount} 收藏
    </Tag>
  );
};

export { StarCard };
