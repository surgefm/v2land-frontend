import React from 'react';
import { NextPage } from 'next';
import getConfig from 'next/config';
import { Layout, Menu, MenuProps, Space, Input, Button, message } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import CopyToClipboard from 'react-copy-to-clipboard';

import { Head, EventTitle, EventDescription, ClientAvatar } from '@Components';
import { UtilService, RedstoneService } from '@Services';
import { ReduxNextPageContext, ISettingsPage } from '@Interfaces';
import { isLoggedIn as isLoggedInSelector } from '@Selectors';

const { Content, Sider } = Layout;
const {
  publicRuntimeConfig: { SITE_URL },
} = getConfig();

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group'
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
    title: label,
  } as MenuItem;
}

const SettingsPage: NextPage<ISettingsPage.IProps, ISettingsPage.InitialProps> = ({ invites }) => {
  const menuItems: MenuProps['items'] = [getItem('邀请链接', 'invite', <MailOutlined />)];

  return (
    <div className="container">
      <Head title="用户设置" />
      <Layout className="container">
        <Sider theme="light" width={256} style={{ paddingTop: '1rem' }} breakpoint="lg">
          <Menu
            mode="inline"
            items={menuItems}
            theme="light"
            defaultSelectedKeys={['invite']}
            defaultOpenKeys={['settings']}
          />
        </Sider>
        <Content style={{ padding: '2rem', overflowY: 'scroll' }}>
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
                        <Button
                          onClick={() => message.success('链接已复制至剪贴板')}
                          type="primary"
                        >
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
        </Content>
      </Layout>
      <style jsx>
        {`
          .container {
            width: 100%;
            padding-top: 3.5rem;
            height: 100vh;
          }

          .container > :global(.container) {
            height: calc(100vh - 3.5rem);
          }

          :global(.invite-code-item) > :global(.ant-space-item):first-child {
            display: flex;
            flex-grow: 1;
          }

          @media (max-width: 700px) {
            .container {
              padding-top: 3rem;
            }

            .container > :global(.container) {
              height: calc(100vh - 3rem);
            }
          }
        `}
      </style>
    </div>
  );
};

SettingsPage.getInitialProps = async (ctx: ReduxNextPageContext): Promise<any> => {
  const isLoggedIn = isLoggedInSelector(ctx.store.getState());
  if (!isLoggedIn) {
    UtilService.redirect(ctx, '/login?redirect=/settings');
    return {};
  }

  return {
    invites: await RedstoneService.getInviteCodes(),
  };
};

export default SettingsPage;
