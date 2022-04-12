import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import { NewsForm } from '@Components/News';
import { canCurrentClientEditEvent, isNewsroomSocketConnected } from '@Selectors';
import { useTranslation } from '@I18n';

import { INewsroomPanelAddNewsButton } from './AddNewsButton';

const NewsroomPanelAddNewsButtonImpl: React.FC<INewsroomPanelAddNewsButton.IProps> = ({
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
        {t('Newsroom_AddNews')}
      </Button>
      <Modal
        title={t('Newsroom_AddNews')}
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <NewsForm eventId={eventId} onOk={handleOk} onCancel={handleCancel} />
      </Modal>
    </>
  );
};

export const NewsroomPanelAddNewsButton = NewsroomPanelAddNewsButtonImpl;
