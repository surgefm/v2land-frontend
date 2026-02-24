import { AppStore } from '@Interfaces';
import { NewsroomSocket } from '@Services';
import { EventActions } from '@Actions';
import { getEventOffshelfStackIdList, getEventStackIdList } from '@Selectors';
import { StackDragData } from './types';

// Module-level flag so StackList can skip FLIP animation for local reorders.
// Set to true before dispatching, consumed & reset by the FLIP hook.
let _isLocalReorder = false;
export function consumeLocalReorderFlag(): boolean {
  const val = _isLocalReorder;
  _isLocalReorder = false;
  return val;
}

export async function handleStackDrop(
  sourceData: StackDragData,
  destDroppableId: string,
  destIndex: number,
  eventId: number,
  store: AppStore,
  socket: NewsroomSocket
) {
  _isLocalReorder = true;

  const id = -Math.abs(eventId);
  const stackId = -Math.abs(sourceData.stackId);

  const { dispatch } = store;
  const offshelfStackIdList = getEventOffshelfStackIdList(id)(store.getState());
  const stackIdList = getEventStackIdList(id)(store.getState());

  const fromOffshelf = sourceData.sourceDroppableId === 'newsroom-offshelf-stack-panel';
  const toOffshelf = destDroppableId === 'newsroom-offshelf-stack-panel';

  if (fromOffshelf === toOffshelf) {
    let newStackIdList = fromOffshelf ? [...offshelfStackIdList] : [...stackIdList];
    newStackIdList = newStackIdList.filter(i => i !== stackId);
    newStackIdList = [
      ...newStackIdList.slice(0, destIndex),
      stackId,
      ...newStackIdList.slice(destIndex),
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

    toList = [...toList.slice(0, destIndex), stackId, ...toList.slice(destIndex)];
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
