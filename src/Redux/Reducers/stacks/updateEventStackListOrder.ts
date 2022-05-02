import { StacksState, EventAction } from '@Interfaces';

const updateEventStackListOrder = (state: StacksState, action: EventAction) => {
  if (!action.stackIdList || !action.eventId) return state;
  const { stackIdList } = action;
  const newList = [...state.list];
  for (let i = 0; i < stackIdList.length; i += 1) {
    const stackId = stackIdList[i];
    const index = newList.findIndex(s => s.id === stackId);
    newList[index].order = stackIdList.length - i;
  }
  return {
    ...state,
    list: newList,
  };
};

export default updateEventStackListOrder;
