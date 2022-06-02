import React, { useState } from 'react';
import { Form, Radio, Input, Space, Button, message } from 'antd';
import { useDispatch } from 'react-redux';

import { RedstoneService } from '@Services';
import { TagCuration } from '@Interfaces';
import { TagActions } from '@Actions';

export const TagCurationForm = ({
  tagId,
  eventId,
  curations,
  onCancel = () => {},
  onSubmit = () => {},
}: {
  tagId: number;
  eventId: number;
  curations: TagCuration[];
  onCancel: (event?: React.MouseEvent) => any;
  onSubmit: (event?: React.MouseEvent) => any;
}) => {
  const curation = curations.find(c => c.tagId === tagId && c.eventId === eventId);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [commentLabel, setCommentLabel] = useState(
    !curation || curation.state === 'certified' ? '点评' : '理由'
  );

  const onChange = () => {
    setCommentLabel(form.getFieldValue('state') === 'certified' ? '点评' : '理由');
  };

  const submit = async () => {
    setLoading(true);
    try {
      const { state, comment } = form.getFieldsValue();
      await RedstoneService.addCuration(tagId, eventId, state, comment);
      const tag = await RedstoneService.getTag(tagId);

      dispatch(TagActions.AddTag(tag));
      message.success('点评成功');
      onSubmit();
    } catch (err) {
      message.error('点评失败');
      // eslint-disable-next-line no-console
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form form={form} initialValues={curation} layout="vertical" onChange={onChange}>
      <Form.Item name="state" label="评分">
        <Radio.Group>
          <Radio value="certified">符合社区编辑标准</Radio>
          <Radio value="need improvement">需改进</Radio>
          <Radio value="warning">不良时间线</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item name="comment" label={commentLabel}>
        <Input.TextArea />
      </Form.Item>
      <Form.Item>
        <Space>
          <Button htmlType="button" disabled={loading} onClick={onCancel}>
            取消
          </Button>
          <Button type="primary" htmlType="submit" loading={loading} onClick={submit}>
            点评
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};
