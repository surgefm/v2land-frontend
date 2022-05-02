import { createSelector } from 'reselect';
import { IStore } from '@Interfaces';

export const getLoadingState = (state: IStore) => state.loading || {};

export const isLoading = (identifier: string) =>
  createSelector(
    getLoadingState,
    loadingState => loadingState[identifier] === true
  );
