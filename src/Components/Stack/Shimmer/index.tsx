import React from 'react';
import { Skeleton, Space } from 'antd';

import { Card } from '@Components/Basic';

export const StackShimmer: React.FunctionComponent = () => (
  <Card>
    <Skeleton title paragraph={{ rows: 3 }} active />
    <Space>
      <Skeleton.Avatar size="small" active />
      <Skeleton.Avatar size="small" active />
      <Skeleton.Avatar size="small" active />
      <Skeleton.Avatar size="small" active />
      <Skeleton.Avatar size="small" active />
    </Space>
  </Card>
);
