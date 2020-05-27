import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { Menu, Dropdown, message } from 'antd';

import { UtilService, usePrevious } from '@Services';
import { ClientActions } from '@Actions';
import { ThunkDispatch } from '@Interfaces';
import { isLoggedIn as isLoggedInSelector, getLoggedInClient } from '@Selectors';

import { ClientAvatar } from '@Components/Client';

export const HeaderUserInfo: React.FunctionComponent = () => {
  const dispatch = useDispatch() as ThunkDispatch;
  const isLoggedIn = useSelector(isLoggedInSelector);
  const prevIsLoggedIn = usePrevious(isLoggedIn);
  const client = useSelector(getLoggedInClient);
  const router = useRouter();

  useEffect(() => {
    if (prevIsLoggedIn && !isLoggedIn) {
      message.success('成功退出登录');
    }
  }, [isLoggedIn]);

  const handleLoginClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      UtilService.redirect(`/login?redirect=${router.asPath}`, {
        hiddenQuery: { silent: 1 },
      });
    }
  };

  if (router.pathname === '/login') return <React.Fragment />;
  if (!isLoggedIn)
    return (
      <a href="/login" onClick={handleLoginClick}>
        登录
      </a>
    );

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    await dispatch(ClientActions.Logout());
  };

  const menu = (
    <Menu>
      <Menu.Item>
        <a href="/logout" onClick={handleLogout}>
          退出登录
        </a>
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={menu}>
      <button type="button" className="container">
        <ClientAvatar showTooltip={false} clientId={client.id} />
        <span>{client.username}</span>
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

            span:not(:first-child) {
              margin-left: 0.3rem;
            }
          `}
        </style>
      </button>
    </Dropdown>
  );
};
