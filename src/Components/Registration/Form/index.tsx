import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { useDispatch } from 'react-redux';

import { RedstoneService, clearNewsroomSockets } from '@Services';
import { ClientActions } from '@Actions';
import { Rules } from '@Definitions';
import { withTranslation } from '@I18n';

import { IRegistrationForm } from './Form';

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 },
};

const tailLayout = {
  wrapperCol: { offset: 4, span: 16 },
};

const RegistrationFormImpl: React.FC<IRegistrationForm.IProps> = ({ t }): JSX.Element => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    const { username, password, nickname, email } = values;
    setIsLoading(true);
    try {
      const { client } = await RedstoneService.register(username, nickname, email, password);
      dispatch(ClientActions.AddClient(client));
      dispatch(ClientActions.SetLoggedInClient(client.id));
      clearNewsroomSockets();
    } catch (err) {
      message.error(err.message);
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
        rules={Rules.username}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label={t('Registration_Nickname')}
        name="nickname"
        validateFirst
        rules={Rules.nickname}
      >
        <Input />
      </Form.Item>

      <Form.Item label={t('Registration_Email')} name="email" validateFirst rules={Rules.email}>
        <Input />
      </Form.Item>

      <Form.Item
        label={t('Registration_Password')}
        name="password"
        validateFirst
        rules={Rules.password}
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

export const RegistrationForm = withTranslation('common')(RegistrationFormImpl);
