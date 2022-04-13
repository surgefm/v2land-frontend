import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Form, Input, Button, Space, DatePicker, message } from 'antd';

import { NewsActions, EventActions } from '@Actions';
import { getNewsroomSocket, RedstoneService } from '@Services';
import { News } from '@Interfaces';
import { useTranslation } from '@I18n';

import { INewsForm } from './Form';

const NewsFormImpl: React.FunctionComponent<INewsForm.IProps> = ({
  eventId,
  useSocket = true,
  disabled = false,
  onOk = () => {},
  onCancel = () => {},
}) => {
  const { t } = useTranslation('common');
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const cancel = async () => {
    setLoading(false);
    onCancel();
    // reset();
  };

  const submit = async () => {
    try {
      await form.validateFields();
    } catch (err) {
      return;
    }

    setLoading(true);

    try {
      const res = await RedstoneService.createNews(`${Math.abs(eventId)}`, {
        ...form.getFieldsValue(),
        time: form.getFieldsValue().time.toDate(),
      });

      const news = res.news as News;
      news.id = -news.id;
      dispatch(NewsActions.AddNews(news));
      dispatch(EventActions.AddNewsToEventOffshelfNewsList(-Math.abs(eventId), -Math.abs(news.id)));
      const socket = getNewsroomSocket(eventId);

      if (useSocket && socket) {
        await socket.addNewsToEvent(news.id);
      }

      onOk();
      form.resetFields();
      message.success('添加成功');
    } catch (err) {
      message.error('新闻添加失败');
    } finally {
      setLoading(false);
    }
  };

  const DatePickerImpl = DatePicker as any;
  const requiredRule = { required: true, warningOnly: true, message: '该栏为必填项' };

  return (
    <Form layout="vertical" form={form}>
      <Form.Item
        name="url"
        label="链接"
        rules={[requiredRule, { type: 'url', warningOnly: true, message: '链接格式不正确' }]}
      >
        <Input placeholder="https://international.caixin.com/2022-04-13/101869318.html" />
      </Form.Item>
      <Form.Item name="title" label={t('Stack_Form_Title')} rules={[requiredRule]}>
        <Input placeholder="哈萨克斯坦在涉乌问题上与俄拉开距离 托卡耶夫如何艰难平衡" />
      </Form.Item>
      <Form.Item name="source" label="来源" rules={[requiredRule]}>
        <Input placeholder="澎湃新闻" />
      </Form.Item>
      <Form.Item
        name="time"
        label={t('Stack_Form_Time')}
        rules={[
          { type: 'object' as const, required: true, warningOnly: true, message: '请选择时间' },
        ]}
      >
        <DatePickerImpl showTime />
      </Form.Item>
      <Form.Item name="abstract" label="摘要" rules={[{ required: false }]}>
        <Input.TextArea autoSize={{ minRows: 2 }} placeholder="" />
      </Form.Item>
      <Form.Item name="comment" label="备注" rules={[{ required: false }]}>
        <Input.TextArea autoSize={{ minRows: 2 }} placeholder="" />
      </Form.Item>
      <Form.Item>
        <Space>
          <Button htmlType="button" disabled={loading} onClick={cancel}>
            {t('Stack_Form_Cancel')}
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            disabled={disabled}
            loading={loading}
            onClick={submit}
          >
            添加
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export const NewsForm = NewsFormImpl;
