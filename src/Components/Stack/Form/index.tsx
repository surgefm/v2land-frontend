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

import { EventCard } from '@Components/EventCard';
import { StackFormEventItem } from './EventItem';
import { IStackForm } from './Form';

const StackFormImpl: React.FunctionComponent<IStackForm.IProps> = ({
  eventId,
  stackId,
  useSocket = true,
  disabled = false,
  onOk = () => {},
  onCancel = () => {},
}) => {
  const { t } = useTranslation('common');
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const stack = useSelector(getStack(stackId || 0));
  const stackIdList = useSelector(getEventStackIdList(eventId));
  const stackEvent = useSelector(getStackEvent(stackId || 0));
  const offshelfStackIdList = useSelector(getEventOffshelfStackIdList(eventId));
  const latestStack = useSelector(getStack(stackIdList[0] || 0)) || {
    title: t('Stack_Form_Title'),
    description: t('Stack_Form_Description'),
  };
  const [loading, setLoading] = useState(false);
  const [stackEventId, setStackEventId] = useState((stack && stack.stackEventId) || 0);
  const [result, setResult] = useState<Event[]>([]);
  const [timer, setTimer] = useState<number>();

  const setFieldsValueWithStack = () => {
    if (stackId && stack) {
      form.setFieldsValue({
        ...stack,
        time: stack.time ? moment(stack.time) : undefined,
        stackEventIdInput: stackEvent ? stackEvent.name : undefined,
      });
    }
  };

  useEffect(() => {
    setFieldsValueWithStack();
  }, []);

  const reset = () => {
    if (stackId && stack) {
      setFieldsValueWithStack();
    } else {
      form.setFieldsValue({
        title: '',
        description: '',
        time: undefined,
        stackEventIdInput: undefined,
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
            stackEventId,
          } as Stack);
          if (stack && stack.stackEventId && !stackEventId) {
            await socket.removeEventFromStack(stackId);
          }
          message.success('成功修改进展');
        } else {
          const res = await socket.createStack({
            ...form.getFieldsValue(),
            stackEventId,
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

  const searchEvent = async (value: string) => {
    if (value.length === 0) {
      setResult([]);
      return;
    }

    const eventList = await RedstoneService.getEventList({
      where: {
        status: 'admitted',
        or: [{ name: { contains: value } }, { id: +value === +value ? +value : 0 }],
      },
    });
    const list: Event[] = [];
    for (let i = 0; i < eventList.length; i += 1) {
      const e = eventList[i];
      dispatch(EventActions.AddEvent(e));
      if (e.id !== Math.abs(eventId)) list.push(e);
    }
    setResult(list);
  };

  const handleEventSearch = (value: string) => {
    if (timer) clearTimeout(timer);
    setTimer(setTimeout(() => searchEvent(value), 200));
  };

  const handleEventSelect = (value: string) => {
    if (!value || value.length === 0) return setStackEventId(0);
    const split = value.split('-');
    const id = split.splice(0, 1);
    if (+id !== +id) return setStackEventId(0);
    setStackEventId(+id);
    if (split.length === 0) return null;
    const name = split.join('-');
    return form.setFieldsValue({ stackEventIdInput: name });
  };

  return (
    <Form layout="vertical" form={form}>
      <Form.Item name="title" label={t('Stack_Form_Title')} rules={[{ required: true }]}>
        <Input placeholder={(stack || latestStack).title} />
      </Form.Item>
      <Form.Item
        name="description"
        label={t('Stack_Form_Description')}
        rules={[{ required: true }]}
      >
        <Input.TextArea
          autoSize={{ minRows: 3 }}
          placeholder={(stack || latestStack).description}
        />
      </Form.Item>
      <Form.Item name="time" label={t('Stack_Form_Time')} rules={[{ required: false }]}>
        <DatePicker showTime />
      </Form.Item>
      <Form.Item
        name="stackEventIdInput"
        label={t('Stack_Form_RelatedTimeline')}
        rules={[{ required: false }]}
      >
        <AutoComplete
          style={{ width: '100%' }}
          onSearch={handleEventSearch}
          onSelect={handleEventSelect}
          onChange={() => setStackEventId(0)}
          placeholder={t('Stack_Form_RelatedTimelinePlaceholder')}
        >
          {result.map(c => (
            <AutoComplete.Option key={`event-${c.id}`} value={`${c.id}-${c.name}`}>
              <Space>
                <StackFormEventItem eventId={c.id} />
              </Space>
            </AutoComplete.Option>
          ))}
        </AutoComplete>
      </Form.Item>
      {stackEventId ? (
        <EventCard
          styles={{ marginTop: '-1rem', border: '1px solid #ccc' }}
          forcePlain
          eventId={stackEventId}
        />
      ) : null}
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

export const StackForm = StackFormImpl;
