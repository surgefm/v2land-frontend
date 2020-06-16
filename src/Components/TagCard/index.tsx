import React from 'react';
import { NumberOutlined } from '@ant-design/icons';
import Link from 'next/link';

import { ITagCard } from './TagCard';

const TagCard: React.FunctionComponent<ITagCard.IProps> = ({ tag }) => {
  return (
    <Link href="/topic/[tagId]" as={`/topic/${tag.id}`}>
      <NumberOutlined className="hashtag" />
      <span>{tag}</span>
      <style jsx>
        {`
          div {
            display: flex;
            align-items: center;
            padding: 0.25rem 1rem;
            background-color: #fff;
            box-shadow: 0 2.5px 7.5px rgba(0, 0, 0, 0.0375);
          }

          div:first-child,
          div.first-child {
            border-top-right-radius: 0.25rem;
            border-top-left-radius: 0.25rem;
            padding-top: 0.5rem;
          }

          div:last-child {
            border-bottom-right-radius: 0.25rem;
            border-bottom-left-radius: 0.25rem;
            padding-bottom: 0.5rem;
          }

          div > :global(.hashtag) {
            font-size: 1.25rem;
            transform: skewX(-10deg);
          }

          span {
            font-size: 1.25rem;
            margin-left: 0.5rem;
          }
        `}
      </style>
    </Link>
  );
};

export { TagCard };
