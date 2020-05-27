import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, message } from 'antd';
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

export const LoginForm: React.FunctionComponent = (): JSX.Element => {
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
      message.error('用户名或密码不正确');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...layout} name="basic" initialValues={{ remember: true }} onFinish={onFinish}>
      <Form.Item
        label="用户名"
        name="username"
        rules={[{ required: true, message: '请输入用户名' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item label="密码" name="password" rules={[{ required: true, message: '请输入密码' }]}>
        <Input.Password />
      </Form.Item>

      <Form.Item {...tailLayout} name="remember" valuePropName="checked">
        <Checkbox>记住我</Checkbox>
      </Form.Item>

      <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit" loading={isLoading}>
          登录
        </Button>
      </Form.Item>
    </Form>
  );
};
