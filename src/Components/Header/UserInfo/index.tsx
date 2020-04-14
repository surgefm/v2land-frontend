import React from 'react';

export const HeaderUserInfo: React.FunctionComponent = () => {
  return (
    <div className="container">
      <img src="/images/default.jpg" alt="User avatar" />
      <span>大头菜</span>
      <style jsx>
        {`
          .container {
            display: flex;
            align-items: center;
          }

          img {
            border-radius: 50%;
            height: 2.5rem;
            width: 2.5rem;
            margin-right: 1rem;
          }
        `}
      </style>
    </div>
  );
};
