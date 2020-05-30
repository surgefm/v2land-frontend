import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Form, Input, Button, Space, message } from 'antd';

import { StackActions, EventActions } from '@Actions';
import { getStack, getEventStackIdList, getEventOffshelfStackIdList } from '@Selectors';
import { getNewsroomSocket } from '@Services';
import { Stack } from '@Interfaces';

import { IStackForm } from './Form';

export const StackForm: React.FunctionComponent<IStackForm.IProps> = ({
  eventId,
  stackId,
  useSocket = true,
  disabled = false,
  onOk = () => {},
  onCancel = () => {},
}) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const stack = useSelector(getStack(stackId || 0));
  const stackIdList = useSelector(getEventStackIdList(eventId));
  const offshelfStackIdList = useSelector(getEventOffshelfStackIdList(eventId));
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
        const socket = getNewsroomSocket(eventId);
        if (!socket) return;
        setLoading(true);
        if (stackId) {
          await socket.updateStack({
            id: stackId,
            ...form.getFieldsValue(),
          } as Stack);
          message.success('成功修改进展');
        } else {
          const res = await socket.createStack({
            ...form.getFieldsValue(),
            order: -offshelfStackIdList.length - 1,
          } as Stack);
          res.stack.id = -Math.abs(res.stack.id);
          dispatch(StackActions.AddStack(res.stack));
          dispatch(EventActions.AddStackToEventOffshelfStackList(eventId, res.stack.id));
          message.success('成功创建进展');
        }
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
          <Button htmlType="button" disabled={loading} onClick={cancel}>
            取消
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            disabled={disabled}
            loading={loading}
            onClick={submit}
          >
            保存
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};
