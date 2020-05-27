import { IStore, IThunkStore } from '@Interfaces';

function isFunction(fn: any) {
  return fn && {}.toString.call(fn) === '[object Function]';
}

export const getState = (state: IThunkStore) =>
  isFunction(state) ? (state as (() => IStore))() : (state as IStore);
