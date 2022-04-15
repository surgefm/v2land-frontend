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
        `}
      </style>
    </div>
  );
};
