import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { Tooltip, Button, message } from 'antd';
import { CloseOutlined, EditOutlined } from '@ant-design/icons';

import {
  getNews,
  canCurrentClientEditEvent,
  isNewsroomSocketConnected,
  getActiveNewsroomId,
} from '@Selectors';
import { Time } from '@Components/Basic';
import { getNewsroomSocket, RedstoneService } from '@Services';
import { NewsActions, EventActions } from '@Actions';
import { NewsDragData } from '@Services/NewsroomDndControl/types';

import { NewsroomPanelCard } from '../Card';
import { INewsroomPanelNewsCard } from './NewsCard';

const NewsroomPanelNewsCard: React.FunctionComponent<INewsroomPanelNewsCard.IProps> = ({
  newsId,
  removable = false,
  sourceDroppableId = 'newsroom-news-panel',
}) => {
  const news = useSelector(getNews(newsId));
  const canEdit = useSelector(canCurrentClientEditEvent());
  const isConnected = useSelector(isNewsroomSocketConnected());
  const newsroomId = useSelector(getActiveNewsroomId);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (!canEdit || !isConnected) return undefined;

    return draggable({
      element: el,
      getInitialData: (): NewsDragData => ({
        type: 'news',
        newsId: Math.abs(newsId),
        sourceDroppableId,
      }),
      onDragStart: () => setIsDragging(true),
      onDrop: () => setIsDragging(false),
    });
  }, [canEdit, isConnected, newsId, sourceDroppableId]);

  const loadNews = async () => {
    const res = await RedstoneService.getNews(Math.abs(newsId));
    res.id = -res.id;
    dispatch(NewsActions.AddNews(res));
  };

  const removeNews = async () => {
    if (!removable) return;
    if (loading) return;
    try {
      setLoading(true);
      const socket = getNewsroomSocket(newsroomId);
      if (socket) {
        await socket.removeNewsFromEvent(Math.abs(newsId), Math.abs(newsroomId));
      }
      dispatch(EventActions.RemoveNewsFromEvent(-Math.abs(newsroomId), -Math.abs(newsId)));
    } catch (err) {
      message.error('删除失败');
    } finally {
      setLoading(false);
    }
  };

  if (!news) {
    loadNews();
    return <div />;
  }

  return (
    <div className={isDragging ? 'dragging' : ''} ref={ref}>
      <NewsroomPanelCard className="news-card">
        {news && (
          <>
            {removable && (
              <span className="remove">
                <Tooltip title="移除备选新闻">
                  <Button size="small" icon={<CloseOutlined />} disabled onClick={removeNews} />
                </Tooltip>
              </span>
            )}
            {removable && (
              <span className="remove">
                <Tooltip title="编辑新闻">
                  <Button size="small" icon={<EditOutlined />} disabled onClick={removeNews} />
                </Tooltip>
              </span>
            )}
          </>
        )}
        <Time time={news.time} className="time" />
        <br />
        {`${news.source || new URL(news.url).hostname.replace('www.', '')} | ${news.title}`}
      </NewsroomPanelCard>
      <style jsx>
        {`
          div {
            width: 100%;
            z-index: 1;
            position: relative;
            cursor: ${canEdit && isConnected ? 'grab' : 'default'};
          }

          div > :global(.news-card) {
            white-space: nowrap;
            overflow-x: hidden;
            line-height: 1.5;
          }

          div :global(.time) {
            line-height: 1;
            font-size: 12px;
          }

          div > :global(.news-card::-webkit-scrollbar) {
            display: none;
          }

          .dragging {
            cursor: grabbing;
          }

          .dragging > :global(.news-card) {
            border: 1px solid #555;
          }

          div {
            margin-top: 0.5rem;
          }

          .remove {
            float: right;
          }

          .remove:first-child {
            margin-left: 0.25rem;
          }
        `}
      </style>
    </div>
  );
};

export { NewsroomPanelNewsCard };
