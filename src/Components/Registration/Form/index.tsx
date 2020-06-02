import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { useDispatch } from 'react-redux';
import { RedstoneService, clearNewsroomSockets } from '@Services';
import { ClientActions } from '@Actions';

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

  const handleValuesChange = () => {};

  const onFinish = async (values: any) => {
    const { username, password } = values;
    setIsLoading(true);
    try {
      const { client } = await RedstoneService.login(username, password);
      dispatch(ClientActions.AddClient(client));
      dispatch(ClientActions.SetLoggedInClient(client.id));
      clearNewsroomSockets();
    } catch (err) {
      message.error('用户名或密码不正确');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form
      {...layout}
      name="basic"
      form={form}
      onValuesChange={handleValuesChange}
      onFinish={onFinish}
    >
      <Form.Item
        label="用户名"
        name="username"
        rules={[{ required: true, message: '请输入用户名' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item label="昵称" name="nickname" rules={[{ required: true, message: '请输入昵称' }]}>
        <Input />
      </Form.Item>

      <Form.Item label="邮箱" name="email" rules={[{ required: true, message: '请输入邮箱地址' }]}>
        <Input />
      </Form.Item>

      <Form.Item label="密码" name="password" rules={[{ required: true, message: '请输入密码' }]}>
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
