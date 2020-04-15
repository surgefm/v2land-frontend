import React from 'react';

export const EventCardTitle: React.FunctionComponent = ({ children }) => (
  <p>
    {children}
    <style jsx>
      {`
        p {
          font-size: 1.25rem;
          font-weight: bold;
          line-height: 1.5;
          color: black;
          margin: 0;
        }
      `}
    </style>
  </p>
);
