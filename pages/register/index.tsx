import React from 'react';
import { NextPage } from 'next';

import { Head, Card, RegistrationForm, Background, Footer, EventTitle } from '@Components';
import { isLoggedIn as isLoggedInSelector } from '@Selectors';
import { UtilService } from '@Services';
import { ReduxNextPageContext } from '@Interfaces';

const RegistrationPage: NextPage = () => {
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
