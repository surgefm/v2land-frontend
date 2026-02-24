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
import lockResource from './lockResource';
import unlockResource from './unlockResource';
import setIndividualStackNewsVisible from './setIndividualStackNewsVisible';
import setNewsroomClientInvitationVisible from './setNewsroomClientInvitationVisible';
import setNewsroomClientRole from './setNewsroomClientRole';
import setNewsroomSocketStatus from './setNewsroomSocketStatus';
import setPanelsOrder from './setPanelsOrder';
import setStackNewsVisible from './setStackNewsVisible';
import setActiveNewsroom from './setActiveNewsroom';
import setAgentStatus from './setAgentStatus';
import appendAgentThinking from './appendAgentThinking';
import finishAgentThinking from './finishAgentThinking';

export const getNewsroomInitialState = () =>
  ({
    showStackNews: true,
    showClientInvitation: false,
    stackNewsVisibility: {},
    panels: Object.keys(NewsroomPanelConsts).map(key => NewsroomPanelConsts[key]),
    activeNewsroom: 0,
    idIndexMap: {},
    list: [],
  } as NewsroomsState);

export const NewsroomReducer = (state = getNewsroomInitialState(), action: NewsroomAction) => {
  switch (action.type) {
    case ActionConsts.App.ResetReducer:
      return getNewsroomInitialState();
    case ActionConsts.Newsroom.AddNewsroom:
    case ActionConsts.Newsroom.UpdateNewsroom:
      return addNewsroom(state, action);
    case ActionConsts.Newsroom.AddNewsroomClient:
      return addNewsroomClient(state, action);
    case ActionConsts.Newsroom.RemoveNewsroomClient:
      return removeNewsroomClient(state, action);
    case ActionConsts.Newsroom.LockResource:
      return lockResource(state, action);
    case ActionConsts.Newsroom.UnlockResource:
      return unlockResource(state, action);
    case ActionConsts.Newsroom.SetPanelsOrder:
      return setPanelsOrder(state, action);
    case ActionConsts.Newsroom.SetStackNewsVisible:
      return setStackNewsVisible(state, action);
    case ActionConsts.Newsroom.SetNewsroomClientInvitationVisible:
      return setNewsroomClientInvitationVisible(state, action);
    case ActionConsts.Newsroom.SetIndividualStackNewsVisible:
      return setIndividualStackNewsVisible(state, action);
    case ActionConsts.Newsroom.SetNewsroomClientRole:
      return setNewsroomClientRole(state, action);
    case ActionConsts.Newsroom.SetNewsroomSocketStatus:
      return setNewsroomSocketStatus(state, action);
    case ActionConsts.Newsroom.SetActiveNewsroom:
      return setActiveNewsroom(state, action);
    case ActionConsts.Newsroom.SetAgentStatus:
      return setAgentStatus(state, action);
    case ActionConsts.Newsroom.AppendAgentThinking:
      return appendAgentThinking(state, action);
    case ActionConsts.Newsroom.FinishAgentThinking:
      return finishAgentThinking(state, action);
    case ActionConsts.Stack.AddStack:
      return addStack(state, action);
    default:
      return state;
  }
};
