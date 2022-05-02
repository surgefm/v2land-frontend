import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { NextPage } from 'next';
import { Space, Divider, message } from 'antd';

import {
  Head,
  Card,
  RegistrationForm,
  Background,
  Footer,
  EventTitle,
  ClientAvatar,
  SSOButtons,
} from '@Components';
import { isLoggedIn as isLoggedInSelector, getClient } from '@Selectors';
import { UtilService } from '@Services';
import { get } from '@Services/API/Http';
import { ReduxNextPageContext, IRegisterPage, Client } from '@Interfaces';
import { useTranslation } from '@I18n';
import { ClientActions } from '@Actions';

const RegistrationPage: NextPage<IRegisterPage.IProps, IRegisterPage.InitialProps> = ({
  invite,
  inviter,
}) => {
  const { t } = useTranslation('common');
  const isLoggedIn = useSelector(isLoggedInSelector);
  const router = useRouter();

  const hasInvite = !!router.query.r;

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
        {hasInvite && invite && inviter && (
          <>
            <Space size={4}>
              <ClientAvatar clientId={invite.ownerId} showTooltip={false} asLink />
              <span>{inviter.nickname} 邀请你成为浪潮社区编辑</span>
            </Space>
            <Divider />
          </>
        )}
        {hasInvite && !invite && (
          <>
            <span>你的邀请码已失效</span>
            <Divider />
          </>
        )}
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

  let invite: any;
  let inviter: Client | null = null;
  const inviteCode = ctx.query.r;
  if (inviteCode) {
    try {
      const res = await get<any>(`/code?inviteCode=${inviteCode}`);
      invite = res.invite;
      await ctx.store.dispatch(ClientActions.GetClient(invite.ownerId));
      inviter = getClient(invite.ownerId)(ctx.store.getState());
    } catch (err) {
      // Do nothing
    }
  }

  return {
    namespacesRequired: ['common'],
    invite,
    inviter,
  };
};

export default RegistrationPage;
