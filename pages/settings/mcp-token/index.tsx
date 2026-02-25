import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import { Space, Button, Input, Alert, Typography, message } from 'antd';
import CopyToClipboard from 'react-copy-to-clipboard';

import { Head, EventTitle } from '@Components';
import { SettingsFrame } from '@Components/Settings';
import { UtilService, RedstoneService } from '@Services';
import { ReduxNextPageContext, ISettingsPage } from '@Interfaces';
import { isLoggedIn as isLoggedInSelector } from '@Selectors';

const { Text } = Typography;

const SettingsMcpTokenPage: NextPage<ISettingsPage.IProps, ISettingsPage.InitialProps> = () => {
  const [hasCredentials, setHasCredentials] = useState(false);
  const [newClientId, setNewClientId] = useState<number | null>(null);
  const [newClientSecret, setNewClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  const checkStatus = async () => {
    try {
      const result = await RedstoneService.getMcpTokenStatus();
      setHasCredentials(result.hasCredentials);
    } catch {
      // ignore
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    checkStatus();
  }, []);

  const generateCredentials = async () => {
    setLoading(true);
    try {
      const result = await RedstoneService.createMcpToken();
      setNewClientId(result.clientId);
      setNewClientSecret(result.clientSecret);
      setHasCredentials(true);
      message.success('MCP 密钥已生成');
    } catch {
      message.error('生成失败');
    } finally {
      setLoading(false);
    }
  };

  const revokeCredentials = async () => {
    setLoading(true);
    try {
      await RedstoneService.revokeMcpToken();
      setHasCredentials(false);
      setNewClientId(null);
      setNewClientSecret(null);
      message.success('MCP 密钥已撤销');
    } catch {
      message.error('撤销失败');
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <SettingsFrame>
        <Head title="MCP 密钥" />
        <Space direction="vertical" style={{ width: '100%', maxWidth: '28rem' }}>
          <EventTitle>MCP 密钥</EventTitle>
          <Text type="secondary">加载中...</Text>
        </Space>
      </SettingsFrame>
    );
  }

  return (
    <SettingsFrame>
      <Head title="MCP 密钥" />
      <Space direction="vertical" style={{ width: '100%', maxWidth: '32rem' }} size="middle">
        <EventTitle>MCP 密钥</EventTitle>

        <Text type="secondary">
          生成 OAuth2 Client ID 和 Client Secret，用于在 Claude、ChatGPT 或其他 MCP 客户端中连接浪潮编辑室。
        </Text>

        {newClientSecret && (
          <Alert
            type="warning"
            showIcon
            message="请妥善保存以下凭据，Client Secret 仅显示一次。"
            style={{ marginBottom: '0.5rem' }}
          />
        )}

        {newClientSecret && newClientId && (
          <Space direction="vertical" style={{ width: '100%' }} size="small">
            <Text strong>Client ID</Text>
            <Space style={{ width: '100%' }}>
              <Input
                value={String(newClientId)}
                readOnly
                style={{ flexGrow: 1 }}
              />
              <CopyToClipboard text={String(newClientId)}>
                <Button onClick={() => message.success('Client ID 已复制')}>复制</Button>
              </CopyToClipboard>
            </Space>

            <Text strong>Client Secret</Text>
            <Space style={{ width: '100%' }}>
              <Input.Password
                value={newClientSecret}
                readOnly
                visibilityToggle
                style={{ flexGrow: 1 }}
              />
              <CopyToClipboard text={newClientSecret}>
                <Button onClick={() => message.success('Client Secret 已复制')}>复制</Button>
              </CopyToClipboard>
            </Space>
          </Space>
        )}

        {hasCredentials && !newClientSecret && (
          <Alert
            type="info"
            showIcon
            message="你已生成 MCP 密钥。如需查看 Client Secret，请重新生成。"
          />
        )}

        <Space>
          {!hasCredentials && (
            <Button type="primary" onClick={generateCredentials} loading={loading}>
              生成密钥
            </Button>
          )}
          {hasCredentials && !newClientSecret && (
            <>
              <Button type="primary" onClick={generateCredentials} loading={loading}>
                重新生成
              </Button>
              <Button danger onClick={revokeCredentials} loading={loading}>
                撤销
              </Button>
            </>
          )}
        </Space>
      </Space>
    </SettingsFrame>
  );
};

SettingsMcpTokenPage.getInitialProps = async (ctx: ReduxNextPageContext): Promise<any> => {
  const isLoggedIn = isLoggedInSelector(ctx.store.getState());
  if (!isLoggedIn) {
    UtilService.redirect(ctx, '/login?redirect=/settings/mcp-token');
    return {};
  }
  return {};
};

export default SettingsMcpTokenPage;
