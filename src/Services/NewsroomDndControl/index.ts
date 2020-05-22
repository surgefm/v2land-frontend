import { DropResult } from 'react-beautiful-dnd';

import { AppStore } from '@Interfaces';
import { NewsroomSocket } from '@Services';

import { handleNewsDragEnd } from './handleNewsDragEnd';
import { handlePanelDragEnd } from './handlePanelDragEnd';
import { handleStackDragEnd } from './handleStackDragEnd';

export async function handleNewsroomDragEnd(
  result: DropResult,
  eventId: number,
  store: AppStore,
  socket: NewsroomSocket
) {
  if (result.reason === 'CANCEL' || !result.destination) return;
  const { destination } = result;
  const isDroppingPanels = destination.droppableId.endsWith('panels');
  const isDroppingNews = destination.droppableId.endsWith('-news-list');
  if (isDroppingPanels) {
    handlePanelDragEnd(result, store);
  } else if (isDroppingNews) {
    await handleNewsDragEnd(result, eventId, store, socket);
  } else {
    await handleStackDragEnd(result, eventId, store, socket);
  }
}
