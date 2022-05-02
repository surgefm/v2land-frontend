import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { Form, Input, Button, Space, message } from 'antd';

import { RedstoneService, UtilService } from '@Services';
import { getLoggedInClient } from '@Selectors';
import { useTranslation } from '@I18n';

export const EventForm = ({ onOk = () => {}, onCancel = () => {} }) => {
  const { t } = useTranslation('common');
  const [form] = Form.useForm();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const client = useSelector(getLoggedInClient);

  const cancel = async () => {
    setLoading(false);
    onCancel();
  };

  const submit = async () => {
    if (loading) return;
    try {
      await form.validateFields();
    } catch (err) {
      return;
    }

    setLoading(true);

    try {
      const res = await RedstoneService.createEvent(form.getFieldsValue());
      const { event } = res;

      onOk();
      form.resetFields();
      message.success('创建成功');
      router.push(`/@${client.username}/${event.id}`);
    } catch (err) {
      message.error(await UtilService.getErrorMessage(err, '创建失败'));
    } finally {
      setLoading(false);
    }
  };

  const requiredRule = { required: true, warningOnly: true, message: '该栏为必填项' };

  return (
    <Form layout="vertical" form={form}>
      <Form.Item name="name" label="标题" rules={[requiredRule]}>
        <Input placeholder="李彦宏入选中国工程院院士候选人事件" />
      </Form.Item>
      <Form.Item name="description" label="简介" rules={[requiredRule]}>
        <Input placeholder="2019 年 4 月 30 日，中国工程院官网公布 2019 年中国工程院院士有效候选人共 531 位。名单中有众多来自于业界的候选人，其中有来自微软的沈向洋，来自百度的王海峰、李彦宏，来自阿里的王坚，来自比亚迪的王传福等业界知名人士。其中，李彦宏的入选引发网民热议。最终增选院士不超过 80 名，将从以上名单中选出。" />
      </Form.Item>
      <Form.Item>
        <Space>
          <Button htmlType="button" disabled={loading} onClick={cancel}>
            {t('Stack_Form_Cancel')}
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            disabled={loading}
            loading={loading}
            onClick={submit}
          >
            创建
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};
