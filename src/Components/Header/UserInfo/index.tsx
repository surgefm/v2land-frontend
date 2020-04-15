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
            padding: 0.25rem 0.65rem 0.25rem 0.25rem;
            border-radius: 1000px;
            transition: all 0.2s;
            cursor: pointer;
            user-select: none;
          }

          .container:hover {
            background-color: rgba(0, 0, 0, 0.075);
          }

          .container:active {
            transform: scale(0.9);
          }

          img {
            border-radius: 50%;
            height: 2.25rem;
            width: 2.25rem;
            margin-right: 0.5rem;
          }
        `}
      </style>
    </div>
  );
};
