import React, { useState, useEffect } from 'react';
import { useSelector, useStore } from 'react-redux';
import { Form, Button, Input, message } from 'antd';

import { getEvent } from '@Selectors';
import { getNewsroomSocket } from '@Services';
import { Event } from '@Interfaces';

import { INewsroomPanelEventDetail } from './EventDetail';

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 6, span: 16 },
};

export const NewsroomPanelEventDetail: React.FunctionComponent<
  INewsroomPanelEventDetail.IProps
> = ({ eventId }) => {
  const [form] = Form.useForm();
  const event = useSelector(getEvent(eventId));
  const store = useStore();
  const [name, setName] = useState(event.name);
  const [description, setDescription] = useState(event.description);

  const [origName, setOrigName] = useState(event.name);
  const [origDescription, setOrigDescription] = useState(event.description);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (origName !== event.name) {
      setName(event.name);
      setOrigName(event.name);
    }
    if (origDescription !== event.description) {
      setDescription(event.description);
      setOrigDescription(event.description);
    }
  }, [event, origName, origDescription]);

  const reset = () => {
    form.setFieldsValue({ name, description });
  };

  const submit = async () => {
    setName(form.getFieldValue('name'));
    setDescription(form.getFieldValue('description'));
    const socket = getNewsroomSocket(eventId, store);
    if (!socket) return;
    setLoading(true);
    try {
      await socket.updateEvent(form.getFieldsValue() as Event);
      message.success('成功更新事件信息');
    } catch (err) {
      // Do nothing
    } finally {
      setLoading(false);
    }
  };

  reset();

  return (
    <Form {...layout} form={form} name="event-detail">
      <Form.Item name="name" label="事件名" rules={[{ required: true }]}>
        <Input placeholder="百度魏则西事件" />
      </Form.Item>
      <Form.Item name="description" label="简介" rules={[{ required: true }]}>
        <Input.TextArea
          autoSize={{ minRows: 3 }}
          placeholder="2016 年 4 月 12 日，21 岁的魏则西因滑膜肉瘤去世，在其生前求医过程中，通过百度搜索到武警北京总队第二医院..."
        />
      </Form.Item>
      <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit" shape="round" loading={loading} onClick={submit}>
          保存
        </Button>
        <Button type="link" htmlType="button" loading={loading} onClick={reset}>
          重置
        </Button>
      </Form.Item>
    </Form>
  );
};
