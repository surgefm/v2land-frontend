import React from 'react';

import { Tag } from '@Components/Tag';
import { StarCard } from '../StarCard';
import { SubscriptionCard } from '../SubscriptionCard';

import { IInfoList } from './InfoList';

export const EventInfoList: React.FC<IInfoList.IProps> = ({
  className,
  starCount,
  subscriptionCount,
  tagIdList = [],
}) => {
  const empty = tagIdList.length === 0 && !starCount;

  return (
    <div className={`container ${className}`}>
      {starCount ? <StarCard starCount={starCount} /> : null}
      {subscriptionCount ? <SubscriptionCard subscriptionCount={subscriptionCount} /> : null}
      {tagIdList.map(tagId => (
        <Tag tagId={tagId} key={`tag-${tagId}`} />
      ))}
      <style jsx>
        {`
        .container {
          margin-top: ${empty ? 0 : '0.5rem'};
          display; flex;
          flex-wrap: wrap;
          height: ${empty ? '0' : '26px'};
          overflow: hidden;
          position: relative;
          z-index: 10;
        }

        .container > :global(*) {
          margin-bottom: 1rem;
        }
      `}
      </style>
    </div>
  );
};
