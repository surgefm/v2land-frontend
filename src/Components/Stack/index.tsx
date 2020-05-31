import React from 'react';
import { useSelector } from 'react-redux';
import { getStack, getStackNewsIdList } from '@Selectors';
import { Card } from '@Components/Basic';
import { Share } from '@Components/Share';

import { IStack } from './Stack';
import { NewsItemList } from './NewsItemList';

export * from './Form';

const Stack: React.FunctionComponent<IStack.IProps> = ({ stackId, displayOrder = true }) => {
  const stack = useSelector(getStack(stackId));
  const newsIdList = useSelector(getStackNewsIdList(stackId));
  if (!stack) return <div />;

  return (
    <Card styles={{ paddingTop: '0', paddingBottom: '0' }}>
      <div className="stack">
        <div className="stack-main">
          <div className="title-area">
            <span className="order-redesigned">
              {displayOrder && typeof stack.order === 'number' ? (
                <p>{stack.order ? stack.order + 1 : 1}</p>
              ) : null}
            </span>

            <h2>{stack.title}</h2>
          </div>

          <div className="content-area">
            <p>{stack.description}</p>
          </div>
        </div>

        <Share type="stack" stack={stack} />

        <NewsItemList newsIdList={newsIdList} />

        <style jsx>
          {`
            .stack-main {
              padding-bottom: 0.1rem;
            }

            .title-area {
              display: flex;
            }

            .title-area h2 {
              margin-top: 1.4rem;
              margin-left: 1rem;
              line-height: 1.5;
            }

            .order-redesigned p {
              margin-top: 0;
              margin-bottom: -2.5rem;
              font-family: 'Lexend Giga', sans-serif;
              font-size: 3rem;
              color: rgba(104, 180, 252);
            }

            .content-area {
              margin-top: 1rem;
            }

            .content-area p {
              line-height: 1.8;
              display: block;
              margin-left: 5.5px;
              margin-right: 5.5px;
            }

            .order {
              color: white;
              background-color: black;
              height: 5rem;
              width: 5rem;
              font-size: 4.25rem;
              position: relative;
              font-family: 'Times New Roman', Times, serif;
              cursor: pointer;
              font-weight: 900;
              transition: all 0.2s;
            }

            @media (max-width: 600px) {
              .stack {
                padding: 0.75rem 1rem;
              }

              .order {
                position: relative;
                right: initial;
                top: 0;
                left: -0.25rem;
                height: 3rem;
                font-size: 3.5rem;
                float: left;
                text-shadow: none !important;
              }
            }
          `}
        </style>
      </div>
    </Card>
  );
};

export { Stack };
