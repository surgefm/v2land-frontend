// #region Local Imports
import { ActionConsts } from '@Definitions';
// #endregion Local Imports

// #region Interface Imports
import { StackAction, StacksState } from '@Interfaces';
// #endregion Interface Imports

const INITIAL_STATE: StacksState = {
  list: [],
  idIndexMap: {},
};

export const StackReducer = (state = INITIAL_STATE, action: StackAction) => {
  switch (action.type) {
    case ActionConsts.Stack.AddStack:
    case ActionConsts.Stack.UpdateStack: {
      if (!action.stack) return state;
      const stackId = action.stackId || action.stack.id;
      if (!stackId) return state;

      const newState = { ...state };
      const index = state.idIndexMap[stackId];
      if (typeof index !== 'undefined') {
        newState.list[index] = action.stack;
        return newState;
      }
      newState.idIndexMap[stackId] = newState.list.length;
      newState.list.push(action.stack);
      return newState;
    }
    default:
      return state;
  }
};
