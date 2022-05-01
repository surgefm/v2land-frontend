import React from 'react';

import { NextPage } from 'next';
import getConfig from 'next/config';
import { Space, Input, Button, message } from 'antd';
import CopyToClipboard from 'react-copy-to-clipboard';

import { Head, EventTitle, EventDescription, ClientAvatar } from '@Components';
import { SettingsFrame } from '@Components/Settings';
import { UtilService, RedstoneService } from '@Services';
import { ReduxNextPageContext, ISettingsPage } from '@Interfaces';
import { isLoggedIn as isLoggedInSelector } from '@Selectors';

const {
  publicRuntimeConfig: { SITE_URL },
} = getConfig();

const SettingsInvitePage: NextPage<ISettingsPage.IProps, ISettingsPage.InitialProps> = ({
  invites,
}) => {
  return (
    <SettingsFrame>
      <Head title="管理邀请链接" />
      <Space direction="vertical" style={{ width: '100%' }}>
        <EventTitle>管理邀请链接</EventTitle>
        {invites.length > 0 ? (
          <Space direction="vertical" style={{ width: '100%' }}>
            {invites.map(invite => (
              <Space
                key={invite.id}
                style={{ whiteSpace: 'nowrap', width: '100%', maxWidth: '28rem' }}
                className="invite-code-item"
              >
                <Input
                  style={{ display: 'flex', flexGrow: '1', width: '100%' }}
                  value={`${SITE_URL}/signup?r=${invite.code}`}
                  disabled={!!invite.userId}
                />
                {!invite.userId && (
                  <CopyToClipboard text={`${SITE_URL}/signup?r=${invite.code}`}>
                    <Button onClick={() => message.success('链接已复制至剪贴板')} type="primary">
                      复制链接
                    </Button>
                  </CopyToClipboard>
                )}
                {invite.userId && (
                  <>
                    <span>已被</span>
                    <ClientAvatar clientId={invite.userId} asLink showRole={false} />
                    <span>使用</span>
                  </>
                )}
              </Space>
            ))}
          </Space>
        ) : (
          <EventDescription description="你暂无可用的邀请链接" />
        )}
      </Space>
      <style jsx>
        {`
          :global(.invite-code-item) > :global(.ant-space-item):first-child {
            display: flex;
            flex-grow: 1;
          }
        `}
      </style>
    </SettingsFrame>
  );
};

SettingsInvitePage.getInitialProps = async (ctx: ReduxNextPageContext): Promise<any> => {
  const isLoggedIn = isLoggedInSelector(ctx.store.getState());
  if (!isLoggedIn) {
    UtilService.redirect(ctx, '/login?redirect=/settings/invite');
    return {};
  }

  return {
    invites: await RedstoneService.getInviteCodes(),
  };
};

export default SettingsInvitePage;
