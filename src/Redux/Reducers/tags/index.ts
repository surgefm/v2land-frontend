// #region Local Imports
import { ActionConsts } from '@Definitions';
// #endregion Local Imports

// #region Interface Imports
import { TagAction, TagsState } from '@Interfaces';
// #endregion Interface Imports

import addTag from './addTag';
import addEventToTag from './addEventToTag';
import removeEventFromTag from './removeEventFromTag';

export const getTagInitialState = () =>
  ({
    list: [],
    idIndexMap: {},
    nameIdMap: {},
  } as TagsState);

export const TagReducer = (state = getTagInitialState(), action: TagAction) => {
  switch (action.type) {
    case ActionConsts.App.ResetReducer:
      return getTagInitialState();
    case ActionConsts.Tag.AddTag:
    case ActionConsts.Tag.UpdateTag:
      return addTag(state, action);
    case ActionConsts.Tag.AddEventToTag:
      return addEventToTag(state, action);
    case ActionConsts.Tag.RemoveEventFromTag:
      return removeEventFromTag(state, action);
    default:
      return state;
  }
};
