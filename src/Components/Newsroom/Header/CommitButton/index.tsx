import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, message } from 'antd';
import { FormOutlined } from '@ant-design/icons';

import { useTranslation } from '@I18n';
import { getNewsroomSocket, NewsroomSocket } from '@Services';
import {
  getActiveNewsroomId,
  canCurrentClientEditEvent,
  isNewsroomSocketConnected,
} from '@Selectors';

import { INewsroomHeaderCommitButton } from './CommitButton';

const NewsroomHeaderCommitButtonImpl: React.FC<INewsroomHeaderCommitButton.IProps> = () => {
  const { t } = useTranslation('common');
  const [isLoading, setLoading] = useState(false);
  const eventId = useSelector(getActiveNewsroomId);
  const canEdit = useSelector(canCurrentClientEditEvent());
  const isConnected = useSelector(isNewsroomSocketConnected());

  const makeCommit = async () => {
    setLoading(true);
    try {
      const socket = getNewsroomSocket(eventId) as NewsroomSocket;
      const { commit } = await socket.makeCommit('Hey', 'Yo');
      if (commit) {
        message.success(t('Newsroom_CommitButton_Success'));
      } else {
        message.info(t('Newsroom_CommitButton_NoChange'));
      }
    } catch (err) {
      // Do nothing
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="button">
      <Button
        type="primary"
        size="large"
        shape="round"
        icon={<FormOutlined />}
        loading={isLoading}
        disabled={!canEdit || !isConnected}
        onClick={makeCommit}
      >
        {t('Newsroom_CommitButton_Label')}
      </Button>
      <style jsx>
        {`
          .button {
            transition: all 0.5s;
            margin-left: 0.5rem;
          }

          .button:active {
            transform: scale(0.9);
          }
        `}
      </style>
    </div>
  );
};

export const NewsroomHeaderCommitButton = NewsroomHeaderCommitButtonImpl;
