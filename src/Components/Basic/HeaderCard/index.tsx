import React from 'react';

export const HeaderCard: React.FC = ({ children }) => {
  return (
    <div className="header-card">
      {children}
      <style jsx>
        {`
          .header-card {
            margin: 0 0 2rem;
            padding: 6rem 18% 2rem 18%;
            background-color: white;
            display: flex;
            justify-content: center;
          }

          @media (max-width: 600px) {
            .header-card {
              padding: 6rem 1rem 2rem;
            }
          }
        `}
      </style>
    </div>
  );
};
