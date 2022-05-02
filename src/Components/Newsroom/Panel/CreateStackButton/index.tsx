import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import { StackForm } from '@Components/Stack/Form';
import { canCurrentClientEditEvent, isNewsroomSocketConnected } from '@Selectors';
import { useTranslation } from '@I18n';

import { INewsroomPanelCreateStackButton } from './CreateStackButton';

const NewsroomPanelCreateStackButtonImpl: React.FC<INewsroomPanelCreateStackButton.IProps> = ({
  eventId,
}) => {
  const { t } = useTranslation('common');
  const canEdit = useSelector(canCurrentClientEditEvent());
  const isConnected = useSelector(isNewsroomSocketConnected(eventId));
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
        disabled={!canEdit || !isConnected}
        icon={<PlusOutlined />}
      >
        {t('Newsroom_CreateStack')}
      </Button>
      <Modal
        title={t('Newsroom_CreateStack')}
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

export const NewsroomPanelCreateStackButton = NewsroomPanelCreateStackButtonImpl;
