import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Form, Button, Input, Upload, message } from 'antd';
import { PictureOutlined } from '@ant-design/icons';
import { UploadChangeParam, UploadFile, RcFile } from 'antd/lib/upload/interface';

import { getEvent, canCurrentClientEditEvent, isNewsroomSocketConnected } from '@Selectors';
import { getNewsroomSocket, imageUploadEndpoint, UtilService } from '@Services';
import { Event, HeaderImage } from '@Interfaces';

import { INewsroomPanelEventDetail } from './EventDetail';

const layout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 18 },
};

const tailLayout = {
  wrapperCol: { offset: 5, span: 18 },
};

export const NewsroomPanelEventDetail: React.FunctionComponent<
  INewsroomPanelEventDetail.IProps
> = ({ eventId }) => {
  const [form] = Form.useForm();
  const event = useSelector(getEvent(eventId));
  const canClientEdit = useSelector(canCurrentClientEditEvent());
  const isConnected = useSelector(isNewsroomSocketConnected(eventId));
  const canEdit = canClientEdit && isConnected;

  const [origData, setOrigData] = useState({
    name: event.name,
    description: event.description,
    headerImageUrl: (event.headerImage || {}).imageUrl || '',
    headerImageSource: (event.headerImage || {}).source || '',
    headerImageSourceUrl: (event.headerImage || {}).sourceUrl || '',
  } as { [index: string]: string });
  const [headerImageUrl, setHeaderImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);

  const submitHeaderImage = async () => {
    const socket = getNewsroomSocket(eventId);
    if (!socket) return;

    const data: { [index: string]: string } = {};
    const headerImageKeys = [['imageUrl', 'Url'], ['source', 'Source'], ['sourceUrl', 'SourceUrl']];
    for (let i = 0; i < headerImageKeys.length; i += 1) {
      const pair = headerImageKeys[i];
      const formKey = `headerImage${pair[1]}`;
      if (origData[formKey] !== form.getFieldValue(formKey)) {
        data[pair[0]] = form.getFieldValue(formKey);
      }
    }
    if (Object.keys(data).length === 0) return;
    data.imageUrl = form.getFieldValue('headerImageUrl');

    await socket.updateHeaderImage({
      eventId: Math.abs(eventId),
      ...data,
    } as HeaderImage);
  };

  const submit = async () => {
    const socket = getNewsroomSocket(eventId);
    if (!socket) return;
    setLoading(true);
    try {
      const data = {
        name: form.getFieldValue('name'),
        description: form.getFieldValue('description'),
      } as Event;
      await socket.updateEvent(data);

      await submitHeaderImage();
      message.success('成功更新事件信息');
    } catch (err) {
      // Do nothing
    } finally {
      setLoading(false);
    }
  };

  const onChange = () => {
    const keys = [
      'name',
      'description',
      'headerImageUrl',
      'headerImageSource',
      'headerImageSourceUrl',
    ];
    for (let i = 0; i < keys.length; i += 1) {
      if (origData[keys[i]] !== form.getFieldValue(keys[i])) {
        return setDisabled(false);
      }
    }
    return setDisabled(true);
  };

  const reset = () => {
    form.setFieldsValue(origData);
    if (origData.headerImageUrl) {
      setHeaderImageUrl(UtilService.getImageUrl(origData.headerImageUrl, 300, 160));
    } else {
      setHeaderImageUrl('');
    }
    onChange();
  };

  const beforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('请上传 .jpg 或 .png 格式的图片');
    }
    const isLt4M = file.size / 1024 / 1024 <= 4;
    if (!isLt4M) {
      message.error('图片不得大于 4MB');
    }
    return isJpgOrPng && isLt4M;
  };

  const onUploadChange = (info: UploadChangeParam<UploadFile<any>>) => {
    const { status } = info.file;
    if (status === 'done') {
      message.success('成功上传题图');
      form.setFieldsValue({
        headerImageUrl: info.file.response.name,
      });
      setHeaderImageUrl(UtilService.getImageUrl(info.file.response.name, 300, 160));
    } else if (status === 'error') {
      message.error('题图上传失败');
    }
  };

  const removeHeaderImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setHeaderImageUrl('');
    form.setFieldsValue({
      headerImageUrl: '',
      headerImageSource: '',
      headerImageSourceUrl: '',
    });
    onChange();
  };

  useEffect(() => {
    const changes: { [index: string]: any } = {};
    const keys = ['name', 'description'];
    for (let i = 0; i < keys.length; i += 1) {
      const key = keys[i];
      if (origData[key] !== event[key]) {
        changes[key] = event[key];
      }
    }

    const headerImageKeys = [['imageUrl', 'Url'], ['source', 'Source'], ['sourceUrl', 'SourceUrl']];
    for (let i = 0; i < headerImageKeys.length; i += 1) {
      const pair = headerImageKeys[i];
      if (origData[`headerImage${pair[1]}`] !== ((event.headerImage || {})[pair[0]] || '')) {
        changes[`headerImage${pair[1]}`] = (event.headerImage || {})[pair[0]] || '';
      }
    }
    if (Object.keys(changes).length > 0) {
      const newData = { ...origData, ...changes };
      setOrigData(newData);
      form.setFieldsValue({ ...form.getFieldsValue(), ...changes });
      if (newData.headerImageUrl) {
        setHeaderImageUrl(UtilService.getImageUrl(newData.headerImageUrl, 300, 160));
      } else {
        setHeaderImageUrl('');
      }
    }
  }, [event]);

  useEffect(() => {
    if (!canEdit) {
      reset();
    }
  }, [canEdit]);

  useEffect(() => {
    reset();
  }, []);

  return (
    <div className="top">
      <Form {...layout} form={form} name="event-detail" onChange={onChange}>
        <Form.Item name="name" label="事件名" rules={[{ required: true }]}>
          <Input placeholder="百度魏则西事件" disabled={!canEdit} />
        </Form.Item>
        <Form.Item name="description" label="简介">
          <Input.TextArea
            disabled={!canEdit}
            autoSize={{ minRows: 3 }}
            placeholder="2016 年 4 月 12 日，21 岁的魏则西因滑膜肉瘤去世，在其生前求医过程中，通过百度搜索到武警北京总队第二医院..."
          />
        </Form.Item>
        <Form.Item label="题图">
          <Upload.Dragger
            accept=".jpg,.jpeg,.png"
            action={imageUploadEndpoint}
            beforeUpload={beforeUpload}
            onChange={onUploadChange}
            showUploadList={false}
            disabled={!canEdit}
            className="upload"
            withCredentials
          >
            {headerImageUrl ? (
              <>
                <div
                  className="upload-image"
                  style={{ backgroundImage: `url(${headerImageUrl})` }}
                  key="upload-image"
                />
                <Button
                  onClick={removeHeaderImage}
                  size="small"
                  className="remove-button"
                  key="remove-header-image-button"
                  disabled={!canEdit}
                >
                  移除题图
                </Button>
              </>
            ) : (
              <>
                <p className="ant-upload-drag-icon">
                  <PictureOutlined />
                </p>
                <p className="ant-upload-hint">添加事件题图</p>
              </>
            )}
          </Upload.Dragger>
        </Form.Item>
        <Form.Item
          style={headerImageUrl ? {} : { display: 'none' }}
          name="headerImageSource"
          label="图片来源"
        >
          <Input placeholder="如新京报、人民日报等" disabled={!canEdit} />
        </Form.Item>
        <Form.Item
          style={headerImageUrl ? {} : { display: 'none' }}
          name="headerImageSourceUrl"
          label="来源链接"
        >
          <Input
            placeholder="http://www.bjnews.com.cn/news/2016/05/03/402053.html"
            disabled={!canEdit}
          />
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            disabled={disabled || !canEdit}
            onClick={submit}
          >
            保存
          </Button>
          <Button type="link" htmlType="reset" disabled={disabled || !canEdit} onClick={reset}>
            重置
          </Button>
        </Form.Item>
      </Form>
      <style jsx>
        {`
          .top {
            margin-top: 0.5rem;
          }

          .top :global(.upload) {
            height: 10rem;
          }

          .top :global(.upload-image) {
            width: 100%;
            height: 100%;
            background-position: 50%;
            background-size: cover;
            background-repeat: no-repeat;
            position: absolute;
            top: 0;
            left: 0;
          }

          .top :global(.remove-button) {
            position: absolute;
            bottom: 0.25rem;
            right: 0.25rem;
            opacity: 0.8;
          }
        `}
      </style>
    </div>
  );
};
