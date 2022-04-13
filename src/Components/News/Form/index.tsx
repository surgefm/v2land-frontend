import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Form, Input, Button, Space, DatePicker, AutoComplete, message } from 'antd';
import moment from 'moment';

import { StackActions, EventActions } from '@Actions';
import {
  getStack,
  getEventStackIdList,
  getEventOffshelfStackIdList,
  getStackEvent,
} from '@Selectors';
import { getNewsroomSocket, RedstoneService } from '@Services';
import { Stack, Event } from '@Interfaces';
import { useTranslation } from '@I18n';

import { INewsForm } from './Form';

const NewsFormImpl: React.FunctionComponent<INewsForm.IProps> = ({
  eventId,
  newsId,
  useSocket = true,
  disabled = false,
  onOk = () => {},
  onCancel = () => {},
}) => {
  const { t } = useTranslation('common');
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState<number>();

  const cancel = async () => {
    setLoading(false);
    onCancel();
    // reset();
  };

  const submit = async () => {
    try {
      await form.validateFields();
    } catch (err) {
      // Do nothing
    }
  };

  const DatePickerImpl = DatePicker as any;

  return (
    <Form layout="vertical" form={form}>
      <Form.Item name="url" label="链接" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="title" label={t('Stack_Form_Title')} rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="abstract" label="摘要" rules={[{ required: true }]}>
        <Input.TextArea autoSize={{ minRows: 3 }} placeholder="" />
      </Form.Item>
      <Form.Item name="time" label={t('Stack_Form_Time')} rules={[{ required: true }]}>
        <DatePickerImpl showTime />
      </Form.Item>
      <Form.Item name="comment" label="备注" rules={[{ required: false }]}>
        <Input.TextArea autoSize={{ minRows: 3 }} placeholder="" />
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
            {t('Stack_Form_Save')}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export const NewsForm = NewsFormImpl;
