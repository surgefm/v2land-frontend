import { DropResult } from 'react-beautiful-dnd';

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
  if (!destination || !source || destination === source) return;
  const { dispatch } = store;
  const newsId = +(draggableId.split('-').pop() as string);
  const isDroppingToStackNewsList = destination.droppableId.startsWith('stack-card-');
  if (isDroppingToStackNewsList) {
    const match = destination.droppableId.match(/^stack-card-(\d+)-news-list$/);
    if (!match) return;
    const stackId = +match[1];
    dispatch(StackActions.AddNewsToStack(stackId, newsId));
    await socket.addNewsToStack(newsId, stackId);
  } else {
    dispatch(EventActions.AddNewsToEventOffshelfNewsList(eventId, newsId));
    const match = source.droppableId.match(/^stack-card-(\d+)-news-list$/);
    if (!match) return;
    const stackId = +match[1];
    await socket.removeNewsFromStack(newsId, stackId);
  }
}
