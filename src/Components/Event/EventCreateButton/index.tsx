import React, { useState } from 'react';
import { Modal, message } from 'antd';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';

import { getLoggedInClient } from '@Selectors';

import { HeaderButton } from '@Components/Header/Button';
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
    <>
      <HeaderButton onClick={showModal}>新建时间线</HeaderButton>
      <Modal
        title="新建时间线"
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <EventForm onOk={handleOk} onCancel={handleCancel} />
      </Modal>
    </>
  );
};
