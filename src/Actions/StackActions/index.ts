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

  AddEventToStack: (stackId: number, eventId: number) => ({
    stackId,
    eventId,
    type: ActionConsts.Stack.AddEventToStack,
  }),

  AddNewsToStack: (stackId: number, newsId: number) => ({
    newsId,
    stackId,
    type: ActionConsts.Stack.AddNewsToStack,
  }),

  RemoveEventFromStack: (stackId: number) => ({
    stackId,
    type: ActionConsts.Stack.RemoveEventFromStack,
  }),

  RemoveNewsFromStack: (stackId: number, newsId: number) => ({
    newsId,
    stackId,
    type: ActionConsts.Stack.RemoveNewsFromStack,
  }),
};
