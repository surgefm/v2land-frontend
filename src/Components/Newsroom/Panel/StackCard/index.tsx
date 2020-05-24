import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Draggable } from 'react-beautiful-dnd';
import { Button, Space, Modal } from 'antd';
import { EyeOutlined, EyeInvisibleOutlined, EditOutlined } from '@ant-design/icons';

import { getStack, getStackNewsIdList, isIndividualStackNewsVisible } from '@Selectors';
import { NewsroomActions } from '@Actions';
import { StackForm } from '@Components/Stack';

import { NewsroomPanelCard } from '../Card';
import { NewsroomPanelNewsList } from '../NewsList';
import { INewsroomPanelStackCard } from './StackCard';

const NewsroomPanelStackCard: React.FunctionComponent<INewsroomPanelStackCard.IProps> = ({
  stackId,
  index,
}) => {
  const dispatch = useDispatch();
  const stack = useSelector(getStack(stackId));
  const newsIdList = useSelector(getStackNewsIdList(stackId));
  const showStackNews = useSelector(isIndividualStackNewsVisible(stackId));
  const [modalVisible, setModalVisible] = useState(false);
  if (!stack) return <div />;

  const handleClick = () => {
    dispatch(NewsroomActions.SetIndividualStackNewsVisible(stackId, !showStackNews));
  };

  return (
    <Draggable draggableId={`stack-card-${Math.abs(stackId)}`} index={index || 0}>
      {provided => (
        <div
          className="top"
          ref={provided.innerRef}
          {...provided.dragHandleProps}
          {...provided.draggableProps}
        >
          <NewsroomPanelCard className="stack-card">
            <div className="card-header">
              <span>{stack.title}</span>
              <Space size={4}>
                <Button
                  onClick={handleClick}
                  size="small"
                  icon={showStackNews ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                />
                <Button
                  onClick={() => setModalVisible(true)}
                  size="small"
                  icon={<EditOutlined />}
                />
              </Space>
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
          <Modal title="修改进展" visible={modalVisible} footer={null}>
            <StackForm
              eventId={stack.eventId as number}
              stackId={stack.id}
              onOk={() => setModalVisible(false)}
              onCancel={() => setModalVisible(false)}
            />
          </Modal>
          <style jsx>
            {`
              .top {
                width: 25rem;
              }

              .top {
                margin-top: 0.5rem;
              }

              .top > :global(.stack-card) {
                background-color: #f4f4f4;
                border-width: 1.5px;
              }

              .top > :global(.stack-card:hover) {
                border-color: #999;
              }

              .card-header {
                display: flex;
                width: 100%;
                justify-content: space-between;
                align-items: center;
              }
            `}
          </style>
        </div>
      )}
    </Draggable>
  );
};

export { NewsroomPanelStackCard };
