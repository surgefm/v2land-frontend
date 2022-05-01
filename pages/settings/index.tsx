import React, { useState } from 'react';
import { NextPage } from 'next';
import { useSelector, useDispatch } from 'react-redux';
import { Space, Form, Input, Button, message } from 'antd';

import { Head, EventTitle } from '@Components';
import { SettingsFrame } from '@Components/Settings';
import { ClientAvatarEditor } from '@Components/Client/AvatarEditor';
import { UtilService, RedstoneService } from '@Services';
import { ReduxNextPageContext, ISettingsPage } from '@Interfaces';
import { ClientActions } from '@Actions';
import { isLoggedIn as isLoggedInSelector, getLoggedInClient } from '@Selectors';
import { Rules } from '@Definitions';
import { useTranslation } from '@I18n';

const { TextArea } = Input;

const SettingsPage: NextPage<ISettingsPage.IProps, ISettingsPage.InitialProps> = () => {
  const { t } = useTranslation('common');
  const client = useSelector(getLoggedInClient);
  const [form] = Form.useForm();
  const [avatar, setAvatar] = useState(client ? client.avatar : '');
  const dispatch = useDispatch();
  const [disabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const decoratedRules = Rules(t, { username: client.username });

  const handleFormChange = () => {
    let d =
      avatar === client.avatar &&
      form.getFieldValue('nickname') === client.nickname &&
      form.getFieldValue('description') === client.description &&
      form.getFieldValue('username') === client.username;
    d =
      d ||
      form.getFieldValue('nickname').length === 0 ||
      form.getFieldValue('username').length === 0;
    setDisabled(d);
  };

  const handleAvatarChange = (value: string) => {
    setAvatar(value);
    if (value !== client.avatar) setDisabled(false);
  };

  const submit = async () => {
    setLoading(true);
    try {
      const response = await RedstoneService.updateClient(client.id, {
        avatar: avatar as string,
        nickname: form.getFieldValue('nickname') as string,
        username: form.getFieldValue('username') as string,
        description: form.getFieldValue('description') as string,
      });
      message.success(t('Client_EditSuccess'));
      dispatch(ClientActions.UpdateClient(client.id, response.client));
    } catch (err) {
      // Do nothing
    } finally {
      setLoading(false);
    }
  };

  return (
    <SettingsFrame>
      <Head title="用户设置" />
      <Space direction="vertical" style={{ width: '100%', maxWidth: '28rem' }}>
        <EventTitle>个人资料</EventTitle>
        <Form form={form} layout="vertical" onValuesChange={handleFormChange} onFinish={submit}>
          <Form.Item
            name="username"
            initialValue={client.username}
            validateFirst
            rules={decoratedRules.username}
            label={t('Registration_Username')}
          >
            <Input placeholder={client.username} />
          </Form.Item>

          <Form.Item
            name="nickname"
            initialValue={client.nickname}
            validateFirst
            rules={decoratedRules.nickname}
            label={t('Client_Nickname')}
          >
            <Input placeholder={client.nickname} />
          </Form.Item>

          <Form.Item name="description" initialValue={client.description} label="简介">
            <TextArea maxLength={80} placeholder={t('Client_DescriptionPlaceholder')} />
          </Form.Item>

          <Form.Item label="头像">
            <ClientAvatarEditor clientId={client.id} onChange={handleAvatarChange} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" disabled={disabled} loading={loading}>
              保存
            </Button>
          </Form.Item>
        </Form>
      </Space>
    </SettingsFrame>
  );
};

SettingsPage.getInitialProps = async (ctx: ReduxNextPageContext): Promise<any> => {
  const isLoggedIn = isLoggedInSelector(ctx.store.getState());
  if (!isLoggedIn) {
    UtilService.redirect(ctx, '/login?redirect=/settings');
    return {};
  }

  return {};
};

export default SettingsPage;
