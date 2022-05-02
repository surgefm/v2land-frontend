import { DropResult } from 'react-beautiful-dnd';
import { message } from 'antd';

import { AppStore } from '@Interfaces';
import { NewsroomSocket } from '@Services';
import { EventActions, StackActions } from '@Actions';

export async function handleNewsDragEnd(
  result: DropResult,
  eventId: number,
  store: AppStore,
  socket: NewsroomSocket
) {
  const { draggableId, destination, source } = result;
  if (!destination) return;
  const { dispatch } = store;
  const newsId = +(draggableId.split('-').pop() as string);
  const isDroppingToStackNewsList = destination.droppableId.startsWith('stack-card-');
  if (isDroppingToStackNewsList) {
    if (destination.droppableId === source.droppableId) {
      if (destination.index !== source.index) {
        message.error('同一进展下，新闻以发布时间排列');
      }
      return;
    }
    const match = destination.droppableId.match(/^stack-card-(\d+)-news-list$/);
    if (!match) return;
    const stackId = +match[1];
    dispatch(StackActions.AddNewsToStack(-Math.abs(stackId), -Math.abs(newsId)));
    await socket.addNewsToStack(newsId, stackId);
  } else {
    if (destination.droppableId === source.droppableId) {
      message.error('备选新闻以添加时间排列');
      return;
    }
    dispatch(EventActions.AddNewsToEventOffshelfNewsList(-Math.abs(eventId), -Math.abs(newsId)));
    const match = source.droppableId.match(/^stack-card-(\d+)-news-list$/);
    if (!match) return;
    const stackId = +match[1];
    await socket.removeNewsFromStack(newsId, stackId);
  }
}
