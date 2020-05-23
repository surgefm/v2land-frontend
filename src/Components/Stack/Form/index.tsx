import React, { useState, useEffect } from 'react';
import { useSelector, useStore, useDispatch } from 'react-redux';
import { Form, Input, Button, Space, message } from 'antd';

import { StackActions, EventActions } from '@Actions';
import { getStack, getEventStackIdList } from '@Selectors';
import { getNewsroomSocket } from '@Services';
import { Stack } from '@Interfaces';

import { IStackForm } from './Form';

export const StackForm: React.FunctionComponent<IStackForm.IProps> = ({
  eventId,
  stackId,
  useSocket = true,
  onOk = () => {},
  onCancel = () => {},
}) => {
  const [form] = Form.useForm();
  const store = useStore();
  const dispatch = useDispatch();
  const stack = useSelector(getStack(stackId || 0));
  const stackIdList = useSelector(getEventStackIdList(eventId));
  const latestStack = useSelector(getStack(stackIdList[0] || 0)) || {
    title: '进展标题',
    description: '进展简介',
  };
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (stackId && stack) {
      form.setFieldsValue(stack);
    }
  }, []);

  const reset = () => {
    if (stackId && stack) {
      form.setFieldsValue(stack);
    } else {
      form.setFieldsValue({
        title: '',
        description: '',
      });
    }
  };

  const submit = async () => {
    try {
      await form.validateFields();
    } catch (err) {
      return;
    }
    try {
      if (useSocket) {
        const socket = getNewsroomSocket(eventId, store);
        if (!socket) return;
        setLoading(true);
        const res = await socket.createStack(form.getFieldsValue() as Stack);
        res.stack.id *= -1;
        dispatch(StackActions.AddStack(res.stack));
        dispatch(EventActions.AddStackToEventOffshelfStackList(eventId, res.stack.id));
        message.success('成功创建进展');
      }
      onOk();
    } catch (err) {
      // Do nothing
    } finally {
      setLoading(false);
    }
  };

  const cancel = async () => {
    setLoading(false);
    onCancel();
    reset();
  };

  return (
    <Form layout="vertical" form={form}>
      <Form.Item name="title" label="标题" rules={[{ required: true }]}>
        <Input placeholder={latestStack.title} />
      </Form.Item>
      <Form.Item name="description" label="简介" rules={[{ required: true }]}>
        <Input.TextArea autoSize={{ minRows: 3 }} placeholder={latestStack.description} />
      </Form.Item>
      <Form.Item>
        <Space>
          <Button shape="round" htmlType="button" disabled={loading} onClick={cancel}>
            取消
          </Button>
          <Button type="primary" htmlType="submit" shape="round" loading={loading} onClick={submit}>
            保存
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};
