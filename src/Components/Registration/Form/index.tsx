import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { useDispatch } from 'react-redux';
import { useTranslation } from '@I18n';

import { RedstoneService, clearNewsroomSockets } from '@Services';
import { ClientActions } from '@Actions';
import { Rules } from '@Definitions';

import { IRegistrationForm } from './Form';

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 },
};

const tailLayout = {
  wrapperCol: { offset: 4, span: 16 },
};

const RegistrationFormImpl: React.FC<IRegistrationForm.IProps> = (): JSX.Element => {
  const { t } = useTranslation('common');
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm();
  const decoratedRules = Rules(t);

  const onFinish = async (values: any) => {
    const { username, password, nickname, email } = values;
    setIsLoading(true);
    try {
      const { client } = await RedstoneService.register(username, nickname, email, password);
      dispatch(ClientActions.AddClient(client));
      dispatch(ClientActions.SetLoggedInClient(client.id));
      clearNewsroomSockets();
    } catch (err) {
      const errorMessage = await err.json();
      message.error(errorMessage.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...layout} name="basic" form={form} onFinish={onFinish} hideRequiredMark>
      <Form.Item
        label={t('Registration_Username')}
        name="username"
        validateFirst
        rules={decoratedRules.username}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label={t('Registration_Nickname')}
        name="nickname"
        validateFirst
        rules={decoratedRules.nickname}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label={t('Registration_Email')}
        name="email"
        validateFirst
        rules={decoratedRules.email}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label={t('Registration_Password')}
        name="password"
        validateFirst
        rules={decoratedRules.password}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit" loading={isLoading}>
          {t('Registration_Submit')}
        </Button>
      </Form.Item>
    </Form>
  );
};

export const RegistrationForm = RegistrationFormImpl;
