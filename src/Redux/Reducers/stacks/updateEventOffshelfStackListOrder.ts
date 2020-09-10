import { StacksState, EventAction } from '@Interfaces';

const updateEventOffshelfStackListOrder = (state: StacksState, action: EventAction) => {
  if (!action.stackIdList || !action.eventId) return state;
  const { stackIdList } = action;
  const newList = [...state.list];
  for (let i = 0; i < stackIdList.length; i += 1) {
    const stackId = stackIdList[i];
    const index = newList.findIndex(s => s.id === stackId);
    newList[index].order = -i - 1;
  }
  return {
    ...state,
    list: newList,
  };
};

export default updateEventOffshelfStackListOrder;
