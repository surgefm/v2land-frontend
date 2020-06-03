import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { NextPage } from 'next';
import { message } from 'antd';

import { Head, Card, RegistrationForm, Background, Footer, EventTitle } from '@Components';
import { isLoggedIn as isLoggedInSelector } from '@Selectors';
import { UtilService } from '@Services';
import { ReduxNextPageContext } from '@Interfaces';

const RegistrationPage: NextPage = () => {
  const isLoggedIn = useSelector(isLoggedInSelector);
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn) {
      UtilService.redirect((router.query.redirect as string) || '/');
      message.success('注册成功');
    }
  }, [isLoggedIn]);

  return (
    <Background>
      <Head title="创建浪潮账号" />
      <Card>
        <EventTitle>创建浪潮账号</EventTitle>
        <RegistrationForm />
      </Card>
      <Footer />
    </Background>
  );
};

RegistrationPage.getInitialProps = async (ctx: ReduxNextPageContext): Promise<any> => {
  const isLoggedIn = isLoggedInSelector(ctx.store.getState());
  if (isLoggedIn) {
    UtilService.redirect(ctx, (ctx.query.redirect as string) || '/');
  }
  return { namespacesRequired: ['common'] };
};

export default RegistrationPage;
