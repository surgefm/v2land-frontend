import React from 'react';
import { ITitle } from './Title';

export const EventTitle: React.FunctionComponent<ITitle.IProps> = ({ className, children }) => {
  return (
    <div className={`title ${className || ''}`}>
      {children}
      <style jsx>
        {`
          .title {
            font-size: 2rem;
            font-weight: bold;
            margin-bottom: 0.25rem;
            line-height: 1.5;
          }

          @media (max-width: 600px) {
            .title {
              font-size: 1.75rem;
              line-height: 1.2;
            }
          }
        `}
      </style>
    </div>
  );
};
