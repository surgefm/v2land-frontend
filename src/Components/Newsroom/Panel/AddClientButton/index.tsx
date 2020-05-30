import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import { NewsroomActions } from '@Actions';
import { canCurrentClientManageEvent, isNewsroomSocketConnected } from '@Selectors';

import { INewsroomPanelAddClientButton } from './AddClientButton';

export const NewsroomPanelAddClientButton: React.FunctionComponent<
  INewsroomPanelAddClientButton.IProps
> = ({ eventId }) => {
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
      添加用户
    </Button>
  );
};
