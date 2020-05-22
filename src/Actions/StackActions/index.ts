// #region Local Imports
import { ActionConsts } from '@Definitions';
import { Stack } from '@Interfaces';
// #endregion Local Imports

export const StackActions = {
  AddStack: (stack: Stack) => ({
    stack,
    type: ActionConsts.Stack.AddStack,
  }),

  UpdateStack: (stackId: number, stack: Stack) => ({
    stackId,
    stack,
    type: ActionConsts.Stack.UpdateStack,
  }),

  AddNewsToStack: (stackId: number, newsId: number) => ({
    newsId,
    stackId,
    type: ActionConsts.Stack.AddNewsToStack,
  }),

  RemoveNewsFromStack: (stackId: number, newsId: number) => ({
    newsId,
    stackId,
    type: ActionConsts.Stack.RemoveNewsFromStack,
  }),
};
