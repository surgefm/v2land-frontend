import React from 'react';
import { IEventCardTitle } from './Title';

export const EventCardTitle: React.FunctionComponent<IEventCardTitle.IProps> = ({
  children,
  className,
}) => (
  <p className={className}>
    {children}
    <style jsx>
      {`
        p {
          font-size: 1.35rem;
          line-height: 1.5;
          color: #000;
          margin: 0;
        }
      `}
    </style>
  </p>
);
