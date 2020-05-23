import React, { useState } from 'react';
import { Button, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import { StackForm } from '@Components/Stack';
import { INewsroomPanelCreateStackButton } from './CreateStackButton';

export const NewsroomPanelCreateStackButton: React.FunctionComponent<
  INewsroomPanelCreateStackButton.IProps
> = ({ eventId }) => {
  const [visible, setVisible] = useState(false);
  const showModal = () => setVisible(true);
  const handleOk = () => {
    setVisible(false);
  };
  const handleCancel = () => setVisible(false);
  return (
    <div>
      <Button type="link" shape="round" onClick={showModal} icon={<PlusOutlined />}>
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
    </div>
  );
};
