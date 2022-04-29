import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { NextPage } from 'next';
import { message } from 'antd';

import {
  Head,
  Card,
  RegistrationForm,
  Background,
  Footer,
  EventTitle,
  SSOButtons,
} from '@Components';
import { isLoggedIn as isLoggedInSelector } from '@Selectors';
import { UtilService } from '@Services';
import { ReduxNextPageContext, IRegisterPage } from '@Interfaces';
import { useTranslation } from '@I18n';

const RegistrationPage: NextPage<IRegisterPage.IProps, IRegisterPage.InitialProps> = () => {
  const { t } = useTranslation('common');
  const isLoggedIn = useSelector(isLoggedInSelector);
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn) {
      UtilService.redirect((router.query.redirect as string) || '/');
      message.success(t('Registration_RegisterSuccess'));
    }
  }, [isLoggedIn]);

  return (
    <Background>
      <Head title={t('Registration_Title')} />
      <Card>
        <EventTitle>{t('Registration_Title')}</EventTitle>
        <RegistrationForm />
        <SSOButtons />
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
