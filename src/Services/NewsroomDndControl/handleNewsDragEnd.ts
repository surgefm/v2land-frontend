import { message } from 'antd';

import { AppStore } from '@Interfaces';
import { NewsroomSocket } from '@Services';
import { EventActions, StackActions } from '@Actions';
import { NewsDragData, NewsListDropData } from './types';

export async function handleNewsDrop(
  sourceData: NewsDragData,
  destData: NewsListDropData,
  eventId: number,
  store: AppStore,
  socket: NewsroomSocket
) {
  const { dispatch } = store;
  const { newsId, sourceDroppableId } = sourceData;
  const { droppableId: destDroppableId } = destData;

  const isDroppingToStackNewsList = destDroppableId.startsWith('stack-card-');
  if (isDroppingToStackNewsList) {
    if (destDroppableId === sourceDroppableId) {
      message.error('同一进展下，新闻以发布时间排列');
      return;
    }
    const match = destDroppableId.match(/^stack-card-(\d+)-news-list$/);
    if (!match) return;
    const stackId = +match[1];
    dispatch(StackActions.AddNewsToStack(-Math.abs(stackId), -Math.abs(newsId)));
    await socket.addNewsToStack(newsId, stackId);
  } else {
    if (destDroppableId === sourceDroppableId) {
      message.error('备选新闻以添加时间排列');
      return;
    }
    dispatch(EventActions.AddNewsToEventOffshelfNewsList(-Math.abs(eventId), -Math.abs(newsId)));
    const match = sourceDroppableId.match(/^stack-card-(\d+)-news-list$/);
    if (!match) return;
    const stackId = +match[1];
    await socket.removeNewsFromStack(newsId, stackId);
  }
}
