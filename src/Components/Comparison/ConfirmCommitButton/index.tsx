import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useSelector, useStore } from 'react-redux';
import { Button, message } from 'antd';
import { CheckOutlined } from '@ant-design/icons';

import { useTranslation } from '@I18n';
import { getNewsroomSocket, NewsroomSocket } from '@Services';
import {
  canCurrentClientEditEvent,
  isNewsroomSocketConnected,
} from '@Selectors';

import { DiffResult } from '../hooks/useDiffData';

interface IProps {
  eventId: number;
  diffResult: DiffResult;
}

export const ConfirmCommitButton: React.FC<IProps> = ({ eventId, diffResult }) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const store = useStore();
  const [isLoading, setLoading] = useState(false);
  const canEdit = useSelector(canCurrentClientEditEvent());
  const isConnected = useSelector(isNewsroomSocketConnected(eventId));

  const makeCommit = async () => {
    setLoading(true);
    try {
      const socket = getNewsroomSocket(eventId, store) as NewsroomSocket;
      const { commit } = await socket.makeCommit('Hey', 'Yo');
      if (commit) {
        message.success(t('Newsroom_CommitButton_Success'));
        const { username, eventName } = router.query;
        router.push(`/${username}/${eventName}/newsroom`);
      } else {
        message.info(t('Newsroom_CommitButton_NoChange'));
      }
    } catch (err) {
      // Do nothing
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    const { username, eventName } = router.query;
    router.push(`/${username}/${eventName}/newsroom`);
  };

  return (
    <div className="confirm-commit">
      <div className="actions">
        <Button
          size="large"
          shape="round"
          onClick={goBack}
        >
          返回编辑室
        </Button>
        <Button
          type="primary"
          size="large"
          shape="round"
          icon={<CheckOutlined />}
          loading={isLoading}
          disabled={!canEdit || !isConnected || !diffResult.hasChanges}
          onClick={makeCommit}
        >
          确认提交
        </Button>
      </div>

      <style jsx>
        {`
          .confirm-commit {
            padding: 1.5rem 0;
            border-top: 1px solid #f0f0f0;
            margin-top: 1rem;
          }

          .actions {
            display: flex;
            justify-content: flex-end;
            gap: 0.75rem;
          }
        `}
      </style>
    </div>
  );
};
