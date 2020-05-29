import React from 'react';

export const Background: React.FunctionComponent = ({ children }) => (
  <div className="background">
    {children}
    <style jsx>
      {`
        .background {
          position: relative;
          z-index: 0;
          margin-top: 3.5rem;
          min-height: calc(100vh - 3.5rem);
          padding: 3.5rem 1rem 1rem 1rem;
          display: flex;
          align-items: center;
          flex-direction: column;
          background-color: #f6f8fa;
        }

        @media (max-width: 600px) {
          .background {
            padding: 4rem 1rem 2rem 1rem;
          }
        }
      `}
    </style>
  </div>
);
