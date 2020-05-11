import React, { useEffect } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { message } from 'antd';

import { Card, LoginForm, Background, Footer } from '@Components';
import { isLoggedIn as isLoggedInSelector } from '@Selectors';
import { ReduxNextPageContext } from '@Interfaces';

const LoginPage: NextPage = () => {
  const isLoggedIn = useSelector(isLoggedInSelector);
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn && router.route !== '/') {
      router.push('/');
      message.success('登录成功');
    }
  }, [isLoggedIn, router]);

  return (
    <Background>
      <Card>
        <LoginForm />
      </Card>
      <Footer />
    </Background>
  );
};

LoginPage.getInitialProps = async (ctx: ReduxNextPageContext): Promise<any> => {
  const isLoggedIn = isLoggedInSelector(ctx.store.getState());
  if (ctx.res && isLoggedIn) {
    ctx.res.writeHead(301, { Location: '/' });
    ctx.res.end();
  }
  return { namespacesRequired: ['common'] };
};

export default LoginPage;
