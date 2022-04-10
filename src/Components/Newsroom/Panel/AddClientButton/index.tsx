import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import { NewsroomActions } from '@Actions';
import { canCurrentClientManageEvent, isNewsroomSocketConnected } from '@Selectors';
import { useTranslation } from '@I18n';

import { INewsroomPanelAddClientButton } from './AddClientButton';

const NewsroomPanelAddClientButtonImpl: React.FC<INewsroomPanelAddClientButton.IProps> = ({
  eventId,
}) => {
  const { t } = useTranslation('common');
  const dispatch = useDispatch();
  const canManage = useSelector(canCurrentClientManageEvent(eventId));
  const isConnected = useSelector(isNewsroomSocketConnected(eventId));

  const showInvitation = () => {
    dispatch(NewsroomActions.SetNewsroomClientInvitationVisible(true));
  };

  return (
    <Button
      type="link"
      shape="round"
      onClick={showInvitation}
      disabled={!canManage || !isConnected}
      icon={<PlusOutlined />}
    >
      {t('Newsroom_AddClient')}
    </Button>
  );
};

export const NewsroomPanelAddClientButton = NewsroomPanelAddClientButtonImpl;
