import { NewsroomsState, StackAction } from '@Interfaces';

const addStack = (state: NewsroomsState, action: StackAction) => {
  if (!action.stack) return state;
  return {
    ...state,
    stackNewsVisibility: {
      ...state.stackNewsVisibility,
      [Math.abs(action.stack.id as number)]:
        state.stackNewsVisibility[action.stack.id] || state.showStackNews,
    },
  };
};

export default addStack;
