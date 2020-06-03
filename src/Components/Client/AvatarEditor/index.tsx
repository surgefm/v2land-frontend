import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Upload, message } from 'antd';
import { PictureOutlined } from '@ant-design/icons';
import { UploadChangeParam, UploadFile, RcFile } from 'antd/lib/upload/interface';

import { imageUploadEndpoint } from '@Services';
import { getClient } from '@Selectors';

import { ClientAvatar } from '../Avatar';
import { IClientAvatarEditor } from './AvatarEditor';
import styles from './AvatarEditor.module.scss';

const { Dragger } = Upload;

export const ClientAvatarEditor: React.FunctionComponent<IClientAvatarEditor.IProps> = ({
  clientId,
  onChange = () => {},
}) => {
  const client = useSelector(getClient(clientId));
  const [avatar, setAvatar] = useState(client ? client.avatar : '');
  const [loading, setLoading] = useState(false);
  if (!client) return <React.Fragment />;

  const beforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('请上传 .jpg 或 .png 格式的图片');
    }
    const isLt4M = file.size / 1024 / 1024 <= 4;
    if (!isLt4M) {
      message.error('图片不得大于 4MB');
    }
    if (isJpgOrPng && !isLt4M) {
      setLoading(true);
    }
    return isJpgOrPng && isLt4M;
  };

  const handleUploadChange = (info: UploadChangeParam<UploadFile<any>>) => {
    setLoading(false);
    const { status } = info.file;
    if (status === 'done') {
      setAvatar(info.file.response.name);
      onChange(info.file.response.name);
      message.success('成功上传头像');
    } else if (status === 'error') {
      message.error('头像上传失败');
    }
  };

  const onResetButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onChange(client.avatar as string);
    setAvatar(client.avatar);
  };

  return (
    <div className={styles.avatar}>
      <ClientAvatar clientId={clientId} avatar={avatar} size={160} showTooltip={false} />
      <Dragger
        beforeUpload={beforeUpload}
        onChange={handleUploadChange}
        className={styles['avatar-upload']}
        action={imageUploadEndpoint}
        showUploadList={false}
        disabled={loading}
        withCredentials
      >
        <p className="ant-upload-drag-icon">
          <PictureOutlined />
        </p>
        {client.avatar === avatar ? (
          <p className="ant-upload-hint">修改头像</p>
        ) : (
          <a href="#" onClick={onResetButtonClick}>
            重置头像
          </a>
        )}
      </Dragger>
    </div>
  );
};
