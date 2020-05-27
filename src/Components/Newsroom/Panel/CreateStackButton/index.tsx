import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import { StackForm } from '@Components/Stack';
import { canCurrentClientEditEvent } from '@Selectors';

import { INewsroomPanelCreateStackButton } from './CreateStackButton';

export const NewsroomPanelCreateStackButton: React.FunctionComponent<
  INewsroomPanelCreateStackButton.IProps
> = ({ eventId }) => {
  const canEdit = useSelector(canCurrentClientEditEvent());
  const [visible, setVisible] = useState(false);
  const showModal = () => setVisible(true);
  const handleOk = () => {
    setVisible(false);
  };
  const handleCancel = () => setVisible(false);
  return (
    <>
      <Button
        type="link"
        shape="round"
        onClick={showModal}
        disabled={!canEdit}
        icon={<PlusOutlined />}
      >
        创建进展
      </Button>
      <Modal
        title="创建进展"
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <StackForm eventId={eventId} onOk={handleOk} onCancel={handleCancel} />
      </Modal>
    </>
  );
};
