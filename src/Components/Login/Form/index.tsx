import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, message } from 'antd';
import { useDispatch } from 'react-redux';

import { RedstoneService, clearNewsroomSockets } from '@Services';
import { ClientActions } from '@Actions';
import { useTranslation } from '@I18n';

import { ILoginForm } from './Form';

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 },
};

const tailLayout = {
  wrapperCol: { offset: 4, span: 16 },
};

const LoginFormImpl: React.FC<ILoginForm.IProps> = (): JSX.Element => {
  const { t } = useTranslation('common');
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const onFinish = async (values: any) => {
    const { username, password } = values;
    setIsLoading(true);
    try {
      const { client } = await RedstoneService.login(username, password);
      dispatch(ClientActions.AddClient(client));
      dispatch(ClientActions.SetLoggedInClient(client.id));
      clearNewsroomSockets();
    } catch (err) {
      message.error(t('Login_AuthenticationFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form
      {...layout}
      name="basic"
      initialValues={{ remember: true }}
      onFinish={onFinish}
      hideRequiredMark
    >
      <Form.Item
        label={t('Login_Username')}
        name="username"
        rules={[{ required: true, message: t('Login_UsernameRequired') }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label={t('Login_Password')}
        name="password"
        rules={[{ required: true, message: t('Login_PasswordRequired') }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item {...tailLayout} name="remember" valuePropName="checked">
        <Checkbox>{t('Login_RememberMe')}</Checkbox>
      </Form.Item>

      <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit" loading={isLoading}>
          {t('Login_Login')}
        </Button>
      </Form.Item>
    </Form>
  );
};

export const LoginForm = LoginFormImpl;
