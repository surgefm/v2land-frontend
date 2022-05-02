import { IAdminPage, ReduxNextPageContext } from '@Interfaces';
import { isLoggedIn as isLoggedInSelector } from '@Selectors';
import { UtilService } from '@Services';
import { NextPage } from 'next';
import React from 'react';

const AdminPage: NextPage<IAdminPage.IProps, IAdminPage.InitialProps> = () => {
  return <div />;
};

AdminPage.getInitialProps = async (ctx: ReduxNextPageContext): Promise<any> => {
  const isLoggedIn = isLoggedInSelector(ctx.store.getState());
  if (!isLoggedIn) {
    UtilService.redirect(ctx, '/login?redirect=/admin');
    return {};
  }

  UtilService.redirect(ctx, '/admin/users');

  return {};
};

export default AdminPage;
