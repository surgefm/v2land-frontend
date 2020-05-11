import React from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { isLoggedIn as isLoggedInSelector, getLoggedInClient } from '@Selectors';

export const HeaderUserInfo: React.FunctionComponent = () => {
  const isLoggedIn = useSelector(isLoggedInSelector);
  const client = useSelector(getLoggedInClient);
  const router = useRouter();

  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      router.push('/login');
    }
  };

  return (
    <button type="button" className="container" onClick={onClick}>
      {isLoggedIn ? <img src="/images/default.jpg" alt="User avatar" /> : <div />}
      <span>{isLoggedIn ? client.username : '登录'}</span>
      <style jsx>
        {`
          .container {
            display: flex;
            align-items: center;
            padding: 0.25rem 0.65rem 0.25rem ${isLoggedIn ? '0.25rem' : '0.65rem'};
            border-radius: 1000px;
            transition: all 0.2s;
            cursor: pointer;
            user-select: none;
            border: none;
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
    </button>
  );
};
