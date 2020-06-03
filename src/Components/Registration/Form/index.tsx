import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { useDispatch } from 'react-redux';
import { RedstoneService, clearNewsroomSockets } from '@Services';
import { ClientActions } from '@Actions';
import { Rules } from '@Definitions';

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 },
};

const tailLayout = {
  wrapperCol: { offset: 4, span: 16 },
};

export const RegistrationForm: React.FunctionComponent = (): JSX.Element => {
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
      <Form.Item label="用户名" name="username" validateFirst rules={Rules.username}>
        <Input />
      </Form.Item>

      <Form.Item label="昵称" name="nickname" validateFirst rules={Rules.nickname}>
        <Input />
      </Form.Item>

      <Form.Item label="邮箱" name="email" validateFirst rules={Rules.email}>
        <Input />
      </Form.Item>

      <Form.Item label="密码" name="password" validateFirst rules={Rules.password}>
        <Input.Password />
      </Form.Item>

      <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit" loading={isLoading}>
          创建
        </Button>
      </Form.Item>
    </Form>
  );
};
