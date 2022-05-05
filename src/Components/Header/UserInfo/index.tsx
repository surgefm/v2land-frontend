import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { Menu, Dropdown, Button, message } from 'antd';

import { UtilService, usePrevious } from '@Services';
import { ClientActions } from '@Actions';
import { ThunkDispatch } from '@Interfaces';
import { isLoggedIn as isLoggedInSelector, getLoggedInClient } from '@Selectors';

import { ClientAvatar } from '@Components/Client';
import { useTranslation } from '@I18n';
import { IHeaderUserInfo } from './UserInfo';

const guardedRoutes = ['/settings', '/settings/invite', '/[username]/[eventName]/newsroom'];

const HeaderUserInfoImpl: React.FC<IHeaderUserInfo.IProps> = () => {
  const { t } = useTranslation('common');
  const dispatch = useDispatch() as ThunkDispatch;
  const isLoggedIn = useSelector(isLoggedInSelector);
  const prevIsLoggedIn = usePrevious(isLoggedIn);
  const client = useSelector(getLoggedInClient);
  const router = useRouter();

  useEffect(() => {
    if (prevIsLoggedIn && !isLoggedIn) {
      message.success('成功退出登录');

      if (guardedRoutes.includes(router.route)) {
        UtilService.redirect(`/login?redirect=${router.asPath}`, {
          hiddenQuery: { silent: 1 },
        });
      }
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
      UtilService.redirect(`/signup?redirect=${router.asPath}`, {
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
        {router.pathname === '/signup' ? null : (
          <Button
            href="/signup"
            type="link"
            onClick={handleRegisterClick}
            className={router.pathname === '/login' ? undefined : 'large'}
          >
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

  const goToSettingsPage = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (router.pathname === '/settings') return;
    UtilService.redirect('/settings');
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
        <a href="/settings" onClick={goToSettingsPage}>
          用户设置
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
    <Dropdown
      overlay={menu}
      trigger={['click']}
      overlayClassName="tooltip-fit-content"
      placement="bottomRight"
    >
      <button type="button" className="container">
        <ClientAvatar showTooltip={false} clientId={client.id} />
        <span className="large">{client.nickname || `@${client.username}`}</span>
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

            @media (max-width: 600px) {
              .container {
                padding: 0.25rem;
              }
            }
          `}
        </style>
      </button>
    </Dropdown>
  );
};

export const HeaderUserInfo = HeaderUserInfoImpl;
