import React from 'react';
import { Tag } from 'antd';
import { BellOutlined } from '@ant-design/icons';

import { ISubscriptionCard } from './SubscriptionCard';

const SubscriptionCard: React.FunctionComponent<ISubscriptionCard.IProps> = ({
  subscriptionCount,
}) => {
  return (
    <Tag color="purple" icon={<BellOutlined />}>
      {subscriptionCount} 订阅
    </Tag>
  );
};

export { SubscriptionCard };
