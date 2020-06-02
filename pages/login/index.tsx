import React, { useEffect } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { message } from 'antd';

import { Head, Card, LoginForm, Background, Footer, EventTitle } from '@Components';
import { isLoggedIn as isLoggedInSelector } from '@Selectors';
import { UtilService } from '@Services';
import { ReduxNextPageContext } from '@Interfaces';

const LoginPage: NextPage = () => {
  const isLoggedIn = useSelector(isLoggedInSelector);
  const router = useRouter();

  useEffect(() => {
    if (router.query.redirect && !router.query.silent) {
      message.info('请先登录');
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      UtilService.redirect((router.query.redirect as string) || '/');
      message.success('登录成功');
    }
  }, [isLoggedIn]);

  return (
    <Background>
      <Head title="登录浪潮" />
      <Card>
        <EventTitle>登录浪潮</EventTitle>
        <LoginForm />
      </Card>
      <Footer />
    </Background>
  );
};

LoginPage.getInitialProps = async (ctx: ReduxNextPageContext): Promise<any> => {
  const isLoggedIn = isLoggedInSelector(ctx.store.getState());
  if (isLoggedIn) {
    UtilService.redirect(ctx, (ctx.query.redirect as string) || '/');
  }
  return { namespacesRequired: ['common'] };
};

export default LoginPage;
