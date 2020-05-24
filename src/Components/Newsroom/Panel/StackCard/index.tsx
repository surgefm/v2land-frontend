import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Draggable } from 'react-beautiful-dnd';
import { Button, Space, Modal } from 'antd';
import { EyeOutlined, EyeInvisibleOutlined, EditOutlined } from '@ant-design/icons';

import {
  getStack,
  getStackNewsIdList,
  isIndividualStackNewsVisible,
  getResourceLocker,
  isResourceLocked,
  canCurrentClientEditEvent,
} from '@Selectors';
import { NewsroomActions } from '@Actions';
import { getNewsroomSocket } from '@Services';
import { StackForm } from '@Components/Stack';

import { NewsroomPanelCard } from '../Card';
import { NewsroomPanelNewsList } from '../NewsList';
import { NewsroomPanelLockMask } from '../LockMask';
import { INewsroomPanelStackCard } from './StackCard';

const NewsroomPanelStackCard: React.FunctionComponent<INewsroomPanelStackCard.IProps> = ({
  stackId,
  index,
  dark,
}) => {
  const dispatch = useDispatch();
  const stack = useSelector(getStack(stackId));
  const newsIdList = useSelector(getStackNewsIdList(stackId));
  const showStackNews = useSelector(isIndividualStackNewsVisible(stackId));
  const locker = useSelector(getResourceLocker('stack', stackId));
  const isLocked = useSelector(isResourceLocked('stack', stackId));
  const canEdit = useSelector(canCurrentClientEditEvent((stack || {}).eventId as number));
  const [modalVisible, setModalVisible] = useState(false);
  if (!stack) return <div />;

  const handleClick = () => {
    dispatch(NewsroomActions.SetIndividualStackNewsVisible(stackId, !showStackNews));
  };

  const startEditing = () => {
    setModalVisible(true);
    const socket = getNewsroomSocket(stack.eventId as number);
    if (!socket) return;
    socket.lockStack(stackId);
  };

  const finishEditing = () => {
    setModalVisible(false);
    const socket = getNewsroomSocket(stack.eventId as number);
    if (!socket) return;
    socket.unlockStack(stackId);
  };

  return (
    <Draggable
      draggableId={`stack-card-${Math.abs(stackId)}`}
      index={index || 0}
      isDragDisabled={isLocked || !canEdit}
    >
      {(provided, snapshot) => (
        <div
          className={['top', snapshot.isDragging ? 'dragging' : ''].join(' ')}
          ref={provided.innerRef}
          {...provided.dragHandleProps}
          {...provided.draggableProps}
        >
          <NewsroomPanelCard className="stack-card">
            <div className="card-header">
              <Space size={4} className="buttons">
                <Button
                  onClick={handleClick}
                  size="small"
                  icon={showStackNews ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                />
                <Button
                  disabled={!canEdit}
                  onClick={startEditing}
                  size="small"
                  icon={<EditOutlined />}
                />
              </Space>
              <span>{stack.title}</span>
            </div>
            {showStackNews ? (
              <NewsroomPanelNewsList
                newsIdList={newsIdList}
                droppableId={`stack-card-${Math.abs(stackId)}-news-list`}
                isNested
              />
            ) : (
              <div />
            )}
          </NewsroomPanelCard>
          {isLocked ? <NewsroomPanelLockMask locker={locker} dark={dark} /> : null}
          <Modal title="修改进展" visible={modalVisible} footer={null}>
            <StackForm
              eventId={stack.eventId as number}
              stackId={stack.id}
              onOk={finishEditing}
              onCancel={finishEditing}
            />
          </Modal>
          <style jsx>
            {`
              .top {
                width: 25rem;
                position: relative;
                margin-top: 0.5rem;
                overflow: hidden;
              }

              .top > :global(.stack-card) {
                background-color: #f4f4f4;
                border-width: 1.5px;
              }

              .top > :global(.stack-card:hover),
              .dragging > :global(.stack-card) {
                border-color: #999;
              }

              .card-header {
                width: 100%;
                justify-content: space-between;
                align-items: center;
              }

              .card-header > :global(.buttons) {
                float: right;
              }

              .card-header > span {
                line-height: 1.8;
              }
            `}
          </style>
        </div>
      )}
    </Draggable>
  );
};

export { NewsroomPanelStackCard };
