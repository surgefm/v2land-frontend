// #region Local Imports
import { ActionConsts, NewsroomPanelConsts } from '@Definitions';
// #endregion Local Imports

// #region Interface Imports
import { NewsroomAction, NewsroomsState } from '@Interfaces';
// #endregion Interface Imports

import addNewsroom from './addNewsroom';
import addNewsroomClient from './addNewsroomClient';
import removeNewsroomClient from './removeNewsroomClient';
import setPanelsOrder from './setPanelsOrder';

const getInitialState = () =>
  ({
    panels: Object.keys(NewsroomPanelConsts).map(key => NewsroomPanelConsts[key]),
    idIndexMap: {},
    list: [],
  } as NewsroomsState);

export const NewsroomReducer = (state = getInitialState(), action: NewsroomAction) => {
  switch (action.type) {
    case ActionConsts.App.ResetReducer:
      return getInitialState();
    case ActionConsts.Newsroom.AddNewsroom:
    case ActionConsts.Newsroom.UpdateNewsroom:
      return addNewsroom(state, action);
    case ActionConsts.Newsroom.AddNewsroomClient:
      return addNewsroomClient(state, action);
    case ActionConsts.Newsroom.RemoveNewsroomClient:
      return removeNewsroomClient(state, action);
    case ActionConsts.Newsroom.SetPanelsOrder:
      return setPanelsOrder(state, action);
    default:
      return state;
  }
};
