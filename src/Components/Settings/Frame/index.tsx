import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Layout, Menu, MenuProps } from 'antd';
import { ApiOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';

const { Content, Sider } = Layout;

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

export const SettingsFrame = ({ children }: { children: React.ReactNode }) => {
  const menuItems: MenuProps['items'] = [
    getItem('个人资料', '/settings', <UserOutlined />),
    getItem('邀请链接', '/settings/invite', <MailOutlined />),
    getItem('MCP 密钥', '/settings/mcp-token', <ApiOutlined />),
  ];

  const router = useRouter();
  const [selectedKeys, setSelectedKeys] = useState([router.route]);

  useEffect(() => {
    setSelectedKeys([router.route]);
  }, [router]);

  const onClick = ({ key }: { key: string }) => {
    router.push(key);
  };

  return (
    <div className="container">
      <Layout hasSider>
        <Sider
          theme="light"
          width={256}
          className="sider"
          style={{
            paddingTop: '1rem',
            overflow: 'auto',
          }}
          breakpoint="lg"
        >
          <Menu
            mode="inline"
            items={menuItems}
            theme="light"
            defaultSelectedKeys={selectedKeys}
            onClick={onClick}
          />
        </Sider>
        <Content className="sider" style={{ padding: '2rem' }}>
          {children}
        </Content>
      </Layout>
      <style jsx>
        {`
          .container {
            width: 100%;
            padding-top: 3.5rem;
            height: 100vh;
          }

          .container :global(.sider) {
            height: calc(100vh - 3.5rem);
            overflow-y: auto;
          }

          @media (max-width: 700px) {
            .container {
              padding-top: 3rem;
            }

            .container :global(.sider) {
              height: calc(100vh - 3rem);
            }
          }
        `}
      </style>
    </div>
  );
};
