import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Form, Input, Space, Button, message } from 'antd';

import { TagActions } from '@Actions';
import {
  getTag,
  getClientsIdWithUsername,
  canCurrentClientManageTag,
  canCurrentClientEditTag,
} from '@Selectors';
import { RedstoneService, UtilService } from '@Services';
import { ClientAvatar } from '@Components/Client';
import { ClientSelector } from '@Components/Client/ClientSelector';
import { TagSelector } from '@Components/Tag/Selector';

import { ITagForm } from './Form';

export const TagForm: React.FC<ITagForm.IProps> = ({
  tagId,
  onCancel = () => {},
  onOk = () => {},
}) => {
  const dispatch = useDispatch();
  const tag = useSelector(getTag(tagId));
  const canEdit = useSelector(canCurrentClientEditTag(tagId));
  const canManage = useSelector(canCurrentClientManageTag(tagId));
  const [curatorInput, setCuratorInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [curatorIdListRaw, setCuratorIdListRaw] = useState<(number | string)[]>([]);
  const curatorIdList = useSelector(getClientsIdWithUsername(curatorIdListRaw));

  const setFieldsValueWithTag = () => {
    if (!tag) return;
    form.setFieldsValue(tag);
    setCuratorIdListRaw(tag.curatorIdList || []);
  };

  useEffect(() => {
    setFieldsValueWithTag();
  }, [tagId]);

  if (!tag) {
    return <></>;
  }

  const addCurator = (clientId: string) => {
    setCuratorIdListRaw([...curatorIdListRaw, clientId]);
    setCuratorInput('');
  };

  const submit = async (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    await form.validateFields();
    setLoading(true);
    const changes: any = {};
    let changed = false;
    // eslint-disable-next-line no-restricted-syntax
    for (const field of ['name', 'description', 'parentId']) {
      if (form.getFieldValue(field) !== (tag as any)[field]) {
        changes[field] = form.getFieldValue(field);
        changed = true;
      }
    }

    try {
      if (changed) {
        await RedstoneService.updateTag(tagId, changes);
      }

      const curatorRequests: Promise<any>[] = [];
      for (let i = 0; i < curatorIdList.length; i += 1) {
        if (!(tag.curatorIdList || []).includes(curatorIdList[i])) {
          curatorRequests.push(RedstoneService.addTagCurator(tagId, curatorIdList[i]));
        }
      }
      if (tag.curatorIdList) {
        for (let i = 0; i < tag.curatorIdList.length; i += 1) {
          if (!curatorIdList.includes(tag.curatorIdList[i])) {
            curatorRequests.push(RedstoneService.removeTagCurator(tagId, tag.curatorIdList[i]));
          }
        }
      }
      await Promise.all(curatorRequests);

      const newTag = await RedstoneService.getTag(tagId);
      dispatch(TagActions.UpdateTag(tagId, newTag));
      onOk(e);
      message.success('修改成功');
    } catch (err) {
      message.error(await UtilService.getErrorMessage(err, '发生错误'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form layout="vertical" form={form}>
      <Form.Item name="name" label="话题" required>
        <Input disabled={!canManage || loading} />
      </Form.Item>
      <Form.Item name="description" label="简介">
        <Input.TextArea placeholder={tag.description} disabled={!canEdit || loading} />
      </Form.Item>
      <Form.Item name="parentId" label="上级话题">
        <TagSelector
          tagId={form.getFieldValue('parentId')}
          disabled={!canManage || loading}
          onChange={parentId =>
            form.setFieldsValue({
              parentId,
            })
          }
        />
      </Form.Item>
      <Form.Item label="话题主持人">
        <ClientSelector
          exceptions={curatorIdList}
          value={curatorInput}
          onChange={setCuratorInput}
          onSelect={addCurator}
          placeholder="@surge"
          disabled={!canManage || loading}
        />
        <div style={{ marginTop: '.5rem', height: '2rem', display: 'block' }}>
          <Space>
            {curatorIdList.map(clientId => (
              <ClientAvatar clientId={clientId} key={clientId} />
            ))}
          </Space>
        </div>
      </Form.Item>

      <Form.Item>
        <Space>
          <Button htmlType="button" disabled={loading} onClick={onCancel}>
            取消
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            disabled={loading}
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

export default TagForm;
