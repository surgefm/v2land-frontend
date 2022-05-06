import React from 'react';
import { NumberOutlined } from '@ant-design/icons';
import Link from 'next/link';

import { ITagCard } from './TagCard';

const TagCard: React.FunctionComponent<ITagCard.IProps> = ({ tag }) => {
  return (
    <Link href="/topic/[tagId]" as={`/topic/${tag.id}`}>
      <div>
        <NumberOutlined className="hashtag" />
        <span>{tag.name}</span>
        <style jsx>
          {`
            div {
              display: flex;
              align-items: center;
              padding: 0.2rem 0rem;
              cursor: pointer;
              margin-right: 0.75rem;
            }

            div:last-child {
              margin-right: 0;
            }

            div > :global(.hashtag) {
              font-size: 1.25rem;
              transform: skewX(-10deg);
            }

            span {
              font-size: 1.25rem;
              margin-left: 0.4rem;
              transition: all 0.2s;
            }

            div:hover * {
              color: rgb(30, 139, 195);
            }
          `}
        </style>
      </div>
    </Link>
  );
};

export { TagCard };
