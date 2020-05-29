import { DropResult } from 'react-beautiful-dnd';

import { AppStore } from '@Interfaces';
import { NewsroomSocket } from '@Services';
import { EventActions } from '@Actions';
import { getEventOffshelfStackIdList, getEventStackIdList } from '@Selectors';

export async function handleStackDragEnd(
  result: DropResult,
  eventId: number,
  store: AppStore,
  socket: NewsroomSocket
) {
  const { destination, source, draggableId } = result;
  if (!destination || !source) return;
  const id = -Math.abs(eventId);
  const match = draggableId.match(/^stack-card-(\d+)$/);
  if (!match) return;
  const stackId = -match[1];

  const { dispatch } = store;
  const offshelfStackIdList = getEventOffshelfStackIdList(id)(store.getState());
  const stackIdList = getEventStackIdList(id)(store.getState());

  const fromOffshelf = source.droppableId === 'newsroom-offshelf-stack-panel';
  const toOffshelf = destination.droppableId === 'newsroom-offshelf-stack-panel';
  if (fromOffshelf === toOffshelf) {
    let newStackIdList = fromOffshelf ? [...offshelfStackIdList] : [...stackIdList];
    newStackIdList = newStackIdList.filter(i => i !== stackId);
    newStackIdList = [
      ...newStackIdList.slice(0, destination.index),
      stackId,
      ...newStackIdList.slice(destination.index),
    ];
    const action = fromOffshelf
      ? EventActions.UpdateEventOffshelfStackListOrder
      : EventActions.UpdateEventStackListOrder;
    dispatch(action(id, newStackIdList.map(i => -Math.abs(i))));
    await socket.updateStackOrders(
      newStackIdList.reverse().map((i, idx) => ({
        stackId: Math.abs(i),
        order: fromOffshelf ? -idx - 1 : idx,
      }))
    );
  } else {
    const removeAction = fromOffshelf
      ? EventActions.UpdateEventOffshelfStackListOrder
      : EventActions.UpdateEventStackListOrder;
    const addAction = toOffshelf
      ? EventActions.UpdateEventOffshelfStackListOrder
      : EventActions.UpdateEventStackListOrder;
    let fromList = fromOffshelf ? [...offshelfStackIdList] : [...stackIdList];
    let toList = toOffshelf ? [...offshelfStackIdList] : [...stackIdList];
    fromList = fromList.filter(i => i !== stackId);
    toList = toList.filter(i => i !== stackId);

    toList = [...toList.slice(0, destination.index), stackId, ...toList.slice(destination.index)];
    dispatch(removeAction(id, fromList.map(i => -Math.abs(i))));
    dispatch(addAction(id, toList.map(i => -Math.abs(i))));
    const offshelfList = fromOffshelf ? fromList : toList;
    const onshelfList = fromOffshelf ? toList : fromList;
    await socket.updateStackOrders([
      ...offshelfList.reverse().map((i, index) => ({
        stackId: Math.abs(i),
        order: -index - 1,
      })),
      ...onshelfList.reverse().map((i, index) => ({
        stackId: Math.abs(i),
        order: index,
      })),
    ]);
  }
}
