import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { Menu, Dropdown, Button, message } from 'antd';

import { UtilService, usePrevious } from '@Services';
import { ClientActions } from '@Actions';
import { ThunkDispatch } from '@Interfaces';
import { isLoggedIn as isLoggedInSelector, getLoggedInClient } from '@Selectors';

import { ClientAvatar } from '@Components/Client';
import { withTranslation } from '@I18n';
import { IHeaderUserInfo } from './UserInfo';

const HeaderUserInfoImpl: React.FC<IHeaderUserInfo.IProps> = ({ t }) => {
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

  const handleRegisterClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      UtilService.redirect(`/register?redirect=${router.asPath}`, {
        hiddenQuery: { silent: 1 },
      });
    }
  };

  if (!isLoggedIn) {
    return (
      <>
        {router.pathname === '/login' ? null : (
          <Button href="/login" type="link" onClick={handleLoginClick}>
            {t('Login_Login')}
          </Button>
        )}
        {router.pathname === '/register' ? null : (
          <Button href="/register" type="link" onClick={handleRegisterClick}>
            {t('Registration_Title')}
          </Button>
        )}
      </>
    );
  }

  const goToProfilePage = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (router.pathname === '/[username]' && router.query.username === `@${client.username}`)
      return;
    UtilService.redirect(`/@${client.username}`);
  };

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    await dispatch(ClientActions.Logout());
  };

  const menu = (
    <Menu>
      <Menu.Item>
        <a href={`/@${client.username}`} onClick={goToProfilePage}>
          个人资料
        </a>
      </Menu.Item>
      <Menu.Item>
        <a href="/logout" onClick={handleLogout}>
          退出登录
        </a>
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={menu} trigger={['click']}>
      <button type="button" className="container">
        <ClientAvatar showTooltip={false} clientId={client.id} />
        <span>{client.nickname || `@${client.username}`}</span>
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
              background-color: #fff;
            }

            .container:hover {
              background-color: rgba(0, 0, 0, 0.075);
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

export const HeaderUserInfo = withTranslation('common')(HeaderUserInfoImpl);
