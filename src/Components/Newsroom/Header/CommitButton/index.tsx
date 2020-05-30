import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, message } from 'antd';
import { FormOutlined } from '@ant-design/icons';

import { getNewsroomSocket, NewsroomSocket } from '@Services';
import {
  getActiveNewsroomId,
  canCurrentClientEditEvent,
  isNewsroomSocketConnected,
} from '@Selectors';

export const NewsroomHeaderCommitButton: React.FunctionComponent = () => {
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
        message.success('成功更新时间线');
      } else {
        message.info('更新失败，时间线没有任何改变');
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
        更新时间线
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
