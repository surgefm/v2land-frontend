// #region Local Imports
import { ActionConsts } from '@Definitions';
import { ChatMessage, ChatMember } from '@Interfaces';
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

  AddMember: (chatId: string, member: ChatMember) => ({
    chatId,
    member,
    type: ActionConsts.Chatroom.AddMember,
  }),

  UpdateMemberLastRead: (chatId: string, clientId: number, lastRead: string) => ({
    chatId,
    clientId,
    lastRead,
    type: ActionConsts.Chatroom.UpdateMemberLastRead,
  }),

  SetActiveChatroom: (chatId: string) => ({
    chatId,
    type: ActionConsts.Chatroom.SetActiveChatroom,
  }),
};
