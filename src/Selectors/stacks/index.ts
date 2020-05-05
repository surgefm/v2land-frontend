// #region Global Imports
import { createSelector } from 'reselect';
import { IStore, Stack } from '@Interfaces';
// #endregion Global Imports

// #region Local Imports
import { getNewsList } from '../news';
// #endregion Local Imports

export const getStacksState = (state: IStore) => state.stacks;

export const getStack = (stackId: number) =>
  createSelector(
    getStacksState,
    stackState => {
      if (typeof stackState.idIndexMap[stackId] === 'undefined') return null;
      return stackState.list[stackState.idIndexMap[stackId]];
    }
  );

export const getStackList = (stackIdList: number[], sorted = false) =>
  createSelector(
    getStacksState,
    stacksState => {
      const stackList: Stack[] = [];
      for (let i = 0; i < stackIdList.length; i += 1) {
        const stackId = stackIdList[i];
        const index = stacksState.idIndexMap[stackId];
        if (typeof index !== 'undefined') {
          stackList.push(stacksState.list[index]);
        }
      }
      if (!sorted) return stackList;
      return stackList.sort((a, b) => (a.order || -1) - (b.order || -1));
    }
  );

export const getStackNewsIdList = (stackId: number) =>
  createSelector(
    getStack(stackId),
    stack => (stack ? stack.newsIdList : []) as number[]
  );

export const getStackNewsList = (stackId: number) =>
  createSelector(
    state => state,
    getStackNewsIdList(stackId),
    (state, newsIdList) => {
      console.log(431, newsIdList);
      getNewsList(newsIdList)(state);
    }
  );
