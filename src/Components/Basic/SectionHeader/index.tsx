import React from 'react';

export const SectionHeader: React.FunctionComponent = ({ children }) => (
  <span>
    {children}
    <style jsx>
      {`
        span {
          font-size: 1.5rem;
          font-weight: bold;
          display: block;
          margin-bottom: 0.5rem;
        }

        span:not(:first-child) {
          margin-top: 1rem;
        }
      `}
    </style>
  </span>
);
