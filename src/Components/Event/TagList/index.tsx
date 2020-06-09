import React from 'react';

import { Tag } from '@Components/Tag';

import { IEventTagList } from './TagList';

export const EventTagList: React.FunctionComponent<IEventTagList.IProps> = ({ tagIdList }) => {
  if (!tagIdList || tagIdList.length === 0) return <React.Fragment />;
  return (
    <div className="tag-list">
      <span>相关话题：</span>
      {tagIdList.map(id => (
        <Tag tagId={id} key={`tag-${id}`} asLink />
      ))}
      <style jsx>
        {`
          .tag-list {
            margin-top: 0.75rem;
            display: flex;
            align-items: center;
            flex-wrap: wrap;
          }

          .tag-list span {
            white-space: nowrap;
          }

          .tag-list > :global(*):not(:first-child) {
            margin: 1.5px 4px 1.5px 0;
          }
        `}
      </style>
    </div>
  );
};
