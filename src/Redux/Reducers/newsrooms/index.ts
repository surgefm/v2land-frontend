// #region Local Imports
import { ActionConsts, NewsroomPanelConsts } from '@Definitions';
// #endregion Local Imports

// #region Interface Imports
import { NewsroomAction, NewsroomsState } from '@Interfaces';
// #endregion Interface Imports

import addNewsroom from './addNewsroom';
import addNewsroomClient from './addNewsroomClient';
import addStack from './addStack';
import removeNewsroomClient from './removeNewsroomClient';
import setIndividualStackNewsVisible from './setIndividualStackNewsVisible';
import setPanelsOrder from './setPanelsOrder';
import setStackNewsVisible from './setStackNewsVisible';

const getInitialState = () =>
  ({
    showStackNews: true,
    stackNewsVisibility: {},
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
    case ActionConsts.Newsroom.SetStackNewsVisible:
      return setStackNewsVisible(state, action);
    case ActionConsts.Newsroom.SetIndividualStackNewsVisible:
      return setIndividualStackNewsVisible(state, action);
    case ActionConsts.Stack.AddStack:
      return addStack(state, action);
    default:
      return state;
  }
};
