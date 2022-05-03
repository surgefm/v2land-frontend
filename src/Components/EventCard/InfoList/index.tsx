import React from 'react';

import { Tag } from '@Components/Tag';
import { StarCard } from '../StarCard';

import { IInfoList } from './InfoList';

export const EventInfoList: React.FC<IInfoList.IProps> = ({
  className,
  starCount,
  tagIdList = [],
}) => {
  if (tagIdList.length === 0 && !starCount) return <React.Fragment />;

  return (
    <div className={`container ${className}`}>
      {starCount ? <StarCard starCount={starCount} /> : null}
      {tagIdList.map(tagId => (
        <Tag tagId={tagId} key={`tag-${tagId}`} />
      ))}
      <style jsx>
        {`
        .container {
          margin-top: .5rem;
          display; flex;
          flex-wrap: wrap;
          height: 1.5rem;
          overflow: hidden;
        }
      `}
      </style>
    </div>
  );
};
