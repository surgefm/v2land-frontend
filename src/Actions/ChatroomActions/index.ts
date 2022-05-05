// #region Local Imports
import { ActionConsts } from '@Definitions';
import { ChatMessage } from '@Interfaces';
// #endregion Local Imports

export const ChatroomActions = {
  AddNewsroom: (chatId: string, chatType: 'client' | 'newsroom', ids: number | number[]) => ({
    chatId,
    chatType,
    ids,
    type: ActionConsts.Chatroom.AddChatroom,
  }),

  AddMessage: (chatId: string, message: ChatMessage) => ({
    chatId,
    message,
    type: ActionConsts.Chatroom.AddMessage,
  }),

  SetActiveChatroom: (chatId: string) => ({
    chatId,
    type: ActionConsts.Chatroom.SetActiveChatroom,
  }),
};
