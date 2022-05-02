import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Layout, Menu, MenuProps } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useTranslation } from 'next-i18next';

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

export const AdminFrame = ({ children }: { children: React.ReactNode }) => {
  const { t } = useTranslation('common');

  const menuItems: MenuProps['items'] = [
    getItem(t('Admin_Users'), '/admin/users', <UserOutlined />),
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
        <Content style={{ padding: '2rem', overflowY: 'scroll' }}>{children}</Content>
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
