import { StacksState, StackAction } from '@Interfaces';

const addEventToStack = (state: StacksState, action: StackAction) => {
  const { stackId, eventId } = action;
  if (!stackId || !eventId) return state;
  const stackIndex = state.idIndexMap[stackId];
  if (typeof stackIndex === 'undefined') return state;
  const stack = { ...state.list[stackIndex] };
  stack.stackEventId = eventId;

  return {
    ...state,
    list: [...state.list.slice(0, stackIndex), stack, ...state.list.slice(stackIndex + 1)],
  };
};

export default addEventToStack;
