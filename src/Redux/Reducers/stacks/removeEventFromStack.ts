import { StacksState, StackAction } from '@Interfaces';

const removeEventFromStack = (state: StacksState, action: StackAction) => {
  const { stackId } = action;
  if (!stackId) return state;
  const stackIndex = state.idIndexMap[stackId];
  if (typeof stackIndex === 'undefined') return state;
  const stack = { ...state.list[stackIndex] };
  stack.stackEventId = undefined;

  return {
    ...state,
    list: [...state.list.slice(0, stackIndex), stack, ...state.list.slice(stackIndex + 1)],
  };
};

export default removeEventFromStack;
