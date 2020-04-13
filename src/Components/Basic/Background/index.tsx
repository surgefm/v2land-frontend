import React from 'react';

export const Background: React.FunctionComponent = ({ children }) => (
  <div className="background">
    {children}
    <style jsx>
      {`
        .background {
          padding: 7rem 1rem 1rem 1rem;
          display: flex;
          align-items: center;
          flex-direction: column;
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
