import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  draggable,
  dropTargetForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { attachClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import { Button, Space, Modal } from 'antd';
import { EyeOutlined, EyeInvisibleOutlined, EditOutlined } from '@ant-design/icons';

import {
  getStack,
  getStackNewsIdList,
  getStackTime,
  isIndividualStackNewsVisible,
  getResourceLocker,
  isResourceLocked,
  isNewsroomSocketConnected,
  canCurrentClientEditEvent,
} from '@Selectors';
import { useTranslation } from '@I18n';
import { NewsroomActions } from '@Actions';
import { getNewsroomSocket } from '@Services';
import { StackDragData, StackItemDropData } from '@Services/NewsroomDndControl/types';
import { StackForm } from '@Components/Stack/Form';
import { EventCard } from '@Components/EventCard';
import { Time } from '@Components/Basic';

import { NewsroomPanelCard } from '../Card';
import { NewsroomPanelNewsList } from '../NewsList';
import { NewsroomPanelLockMask } from '../LockMask';
import { INewsroomPanelStackCard } from './StackCard';

const NewsroomPanelStackCardImpl: React.FunctionComponent<INewsroomPanelStackCard.IProps> = ({
  stackId,
  index,
  sourceDroppableId = 'newsroom-stack-panel',
  dark,
  cardRef,
}) => {
  const { t } = useTranslation('common');
  const dispatch = useDispatch();
  const stack = useSelector(getStack(stackId));
  const newsIdList = useSelector(getStackNewsIdList(stackId));
  const time = useSelector(getStackTime(stackId));
  const showStackNews = useSelector(isIndividualStackNewsVisible(stackId));
  const locker = useSelector(getResourceLocker('stack', stackId));
  const isLocked = useSelector(isResourceLocked('stack', stackId));
  const canEdit = useSelector(canCurrentClientEditEvent((stack || {}).eventId as number));
  const isConnected = useSelector(isNewsroomSocketConnected((stack || {}).eventId as number));
  const [modalVisible, setModalVisible] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!canEdit) {
      setModalVisible(false);
    }
  }, [canEdit]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const cleanups = [
      // Register as drop target for stack reordering edge detection
      dropTargetForElements({
        element: el,
        canDrop: ({ source }) => source.data.type === 'stack',
        getData: ({ input, element }) => {
          const data: StackItemDropData = {
            type: 'stack-item',
            stackId: Math.abs(stackId),
            index: index || 0,
            closestEdge: null,
          };
          return attachClosestEdge(data, {
            input,
            element,
            allowedEdges: ['top', 'bottom'],
          });
        },
      }),
    ];

    // Only register as draggable if allowed
    if (!isLocked && canEdit && isConnected) {
      cleanups.push(
        draggable({
          element: el,
          getInitialData: (): StackDragData => ({
            type: 'stack',
            stackId: Math.abs(stackId),
            index: index || 0,
            sourceDroppableId,
          }),
          onDragStart: () => setIsDragging(true),
          onDrop: () => setIsDragging(false),
        })
      );
    }

    return combine(...cleanups);
  }, [isLocked, canEdit, isConnected, stackId, index, sourceDroppableId]);

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
    <div className={['top', isDragging ? 'dragging' : ''].join(' ')} ref={el => {
      (ref as React.MutableRefObject<HTMLDivElement | null>).current = el;
      cardRef?.(el);
    }}>
      <NewsroomPanelCard className="stack-card">
        <div className="card-header">
          <Space size={4} className="buttons">
            <Button
              onClick={handleClick}
              size="small"
              icon={showStackNews ? <EyeOutlined /> : <EyeInvisibleOutlined />}
            />
            <Button
              disabled={!canEdit || !isConnected}
              onClick={startEditing}
              size="small"
              icon={<EditOutlined />}
            />
          </Space>
          <span>{stack.title}</span>
          {time ? <span> — </span> : null}
          <Time time={time} style={{ color: '#666' }} />
        </div>
        {showStackNews ? (
          <>
            {stack.stackEventId ? (
              <div>
                <EventCard
                  eventId={stack.stackEventId}
                  forcePlain
                  styles={{ margin: '0.25rem 0', borderRadius: '0.25rem' }}
                />
              </div>
            ) : null}
            <NewsroomPanelNewsList
              newsIdList={newsIdList}
              droppableId={`stack-card-${Math.abs(stackId)}-news-list`}
              isNested
            />
          </>
        ) : (
          <React.Fragment />
        )}
      </NewsroomPanelCard>
      {isLocked ? <NewsroomPanelLockMask locker={locker} dark={dark} /> : <React.Fragment />}
      <Modal
        title={t('Newsroom_StackCard_Edit')}
        visible={modalVisible && canEdit}
        onCancel={finishEditing}
        footer={null}
      >
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
            cursor: ${!isLocked && canEdit && isConnected ? 'grab' : 'default'};
          }

          .top > :global(.stack-card) {
            background-color: #f4f4f4;
            border-width: 1.5px;
          }

          .top > :global(.stack-card:hover),
          .dragging > :global(.stack-card) {
            border-color: #999;
          }

          .dragging {
            cursor: grabbing;
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
  );
};

export const NewsroomPanelStackCard = NewsroomPanelStackCardImpl;
