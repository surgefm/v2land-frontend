import React from 'react';
import { useSelector } from 'react-redux';

import { getStack } from '@Selectors';
import { Card } from '@Components/Basic';

import { IStack } from './Stack';

const Stack: React.FunctionComponent<IStack.IProps> = ({ stackId }) => {
  const stack = useSelector(getStack(stackId));
  if (!stack) return <div />;

  return (
    <Card>
      <div className="stack">
        {stack.order ? <span className="order light-font">{stack.order}</span> : null}
        <span>{stack.title}</span>
      </div>
      <style jsx>
        {`
          .stack {
            position: relative;
            padding: 0;
          }

          .order {
            font-size: 4.25rem;
            height: 4.25rem;
            line-height: 1;
            position: absolute;
            right: calc(100% - 1.25rem);
            top: 0.5rem;
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
    </Card>
  );
};

export { Stack };
