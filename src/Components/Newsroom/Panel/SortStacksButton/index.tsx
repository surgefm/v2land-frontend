import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, message } from 'antd';
import { SortAscendingOutlined } from '@ant-design/icons';

import {
  canCurrentClientEditEvent,
  isNewsroomSocketConnected,
  getEventStackList,
  getEventOffshelfStackList,
  isEventStackListSorted,
  isEventOffshelfStackListSorted,
} from '@Selectors';
import { getNewsroomSocket } from '@Services';
import { EventActions } from '@Actions';

import { INewsroomPanelSortStacksButton } from './SortStacksButton';

export const NewsroomPanelSortStacksButton: React.FunctionComponent<
  INewsroomPanelSortStacksButton.IProps
> = ({ eventId, offshelf = false }) => {
  const canEdit = useSelector(canCurrentClientEditEvent());
  const isConnected = useSelector(isNewsroomSocketConnected(eventId));
  const stackList = useSelector(
    offshelf ? getEventOffshelfStackList(eventId) : getEventStackList(eventId)
  );
  const sorted = useSelector(
    offshelf ? isEventOffshelfStackListSorted(eventId) : isEventStackListSorted(eventId)
  );
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [changed, setChanged] = useState(false);

  useEffect(() => {
    if (changed) {
      const socket = getNewsroomSocket(eventId);
      if (!socket) return;
      socket
        .updateStackOrders(
          stackList
            .map(s => s.id)
            .reverse()
            .map((i, idx) => ({
              stackId: Math.abs(i),
              order: offshelf ? -idx - 1 : idx,
            }))
        )
        .then(() => {
          setLoading(false);
          message.success('成功调整进展顺序');
        });
      setChanged(false);
    }
  }, [stackList]);

  const handleClick = async () => {
    setLoading(true);
    if (offshelf) dispatch(EventActions.SortEventOffshelfStackList(eventId));
    else dispatch(EventActions.SortEventStackList(eventId));
    setChanged(true);
  };

  return (
    <div className={offshelf ? 'offshelf' : ''}>
      <Button
        type="link"
        shape="round"
        disabled={!canEdit || !isConnected || sorted || loading}
        onClick={handleClick}
        icon={<SortAscendingOutlined />}
      >
        整理进展
      </Button>
      <style jsx>
        {`
          div:not(.offshelf) :global(.ant-btn) {
            color: #fff;
          }

          div:not(.offshelf) :global(.ant-btn):disabled {
            color: rgb(199, 199, 199) !important;
          }

          div:not(.offshelf) :global(.ant-btn):hover {
            color: #efefef;
          }

          div.offshelf :global(.ant-btn) {
            padding: 4px 4px 4px 16px;
          }
        `}
      </style>
    </div>
  );
};
