// #region Local Imports
import { ActionConsts } from '@Definitions';
// #endregion Local Imports

// #region Interface Imports
import { ChatroomAction, ChatroomsState } from '@Interfaces';
// #endregion Interface Imports

import addChatroom from './addChatroom';
import addMessage from './addMessage';
import setActiveChatroom from './setActiveChatroom';

export const getChatroomInitialState = () =>
  ({
    activeChatroom: '',
    chatrooms: {},
  } as ChatroomsState);

export const ChatroomReducer = (
  state = getChatroomInitialState(),
  action: ChatroomAction
): ChatroomsState => {
  switch (action.type) {
    case ActionConsts.App.ResetReducer:
      return getChatroomInitialState();
    case ActionConsts.Chatroom.AddChatroom:
      return addChatroom(state, action);
    case ActionConsts.Chatroom.AddMessage:
      return addMessage(state, action);
    case ActionConsts.Chatroom.SetActiveChatroom:
      return setActiveChatroom(state, action);
    default:
      return state;
  }
};
