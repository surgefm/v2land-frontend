import React, { useState } from 'react';
import { Button, Modal, message } from 'antd';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';

import { getLoggedInClient } from '@Selectors';

import { SubnodeOutlined } from '@ant-design/icons';
import { EventForm } from '../Form';

export const EventCreateButton = () => {
  const user = useSelector(getLoggedInClient);
  const [visible, setVisible] = useState(false);
  const router = useRouter();

  const showModal = () => {
    if (!user) {
      message.info('请先登录');
      router.push(`/login?redirect=${router.asPath}`);
      return;
    }
    setVisible(true);
  };
  const handleOk = () => {
    setVisible(false);
  };
  const handleCancel = () => setVisible(false);

  return (
    <div className="button">
      <Button
        type="primary"
        size="large"
        shape="round"
        icon={<SubnodeOutlined />}
        onClick={showModal}
      >
        创建时间线
      </Button>
      <Modal
        title="创建时间线"
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <EventForm onOk={handleOk} onCancel={handleCancel} />
      </Modal>
      <style jsx>
        {`
          .button {
            transition: all 0.5s;
            margin-left: 0.5rem;
          }
        `}
      </style>
    </div>
  );
};
