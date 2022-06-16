import React, { useEffect } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { message } from 'antd';

import { Head, Card, LoginForm, Background, Footer, EventTitle, SSOButtons } from '@Components';
import { isLoggedIn as isLoggedInSelector } from '@Selectors';
import { UtilService } from '@Services';
import { ReduxNextPageContext, ILoginPage } from '@Interfaces';
import { useTranslation } from '@I18n';

const LoginPage: NextPage<ILoginPage.IProps, ILoginPage.InitialProps> = () => {
  const { t } = useTranslation('common');
  const isLoggedIn = useSelector(isLoggedInSelector);
  const router = useRouter();

  useEffect(() => {
    if (router.query.redirect && !router.query.silent) {
      message.info(t('Login_PleaseLogin'));
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      UtilService.redirect((router.query.redirect as string) || '/');
      message.success(t('Login_LoginSuccess'));
    }
  }, [isLoggedIn]);

  return (
    <Background>
      <Head title={t('Login_Title')} />
      <Card styles={{ overflow: 'hidden' }}>
        <EventTitle>{t('Login_Title')}</EventTitle>
        <LoginForm />
        <SSOButtons />
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
