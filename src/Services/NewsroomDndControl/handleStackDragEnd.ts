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
  const { destination, source } = result;
  if (!destination || !source) return;
  const id = -Math.abs(eventId);
  const { dispatch } = store;
  const offshelfStackIdList = getEventOffshelfStackIdList(id)(store.getState());
  const stackIdList = getEventStackIdList(id)(store.getState());

  const fromOffshelf = source.droppableId === 'newsroom-offshelf-stack-panel';
  const toOffshelf = destination.droppableId === 'newsroom-offshelf-stack-panel';
  if (fromOffshelf === toOffshelf) {
    let newStackIdList = fromOffshelf ? [...offshelfStackIdList] : [...stackIdList];
    const stackId = newStackIdList.splice(source.index, 1)[0];
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
      newStackIdList.reverse().map((i, index) => ({
        stackId: Math.abs(i),
        order: fromOffshelf ? -index - 1 : index,
      }))
    );
  } else {
    const removeAction = fromOffshelf
      ? EventActions.UpdateEventOffshelfStackListOrder
      : EventActions.UpdateEventStackListOrder;
    const addAction = toOffshelf
      ? EventActions.UpdateEventOffshelfStackListOrder
      : EventActions.UpdateEventStackListOrder;
    const fromList = fromOffshelf ? [...offshelfStackIdList] : [...stackIdList];
    let toList = toOffshelf ? [...offshelfStackIdList] : [...stackIdList];
    const stackId = fromList.splice(source.index, 1)[0];
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
