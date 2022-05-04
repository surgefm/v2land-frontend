import { createSelector } from 'reselect';
import { IStore } from '@Interfaces';

export const getChatroomsState = (state: IStore) => state.chatrooms;

export const getActiveChatroomId = createSelector(
  getChatroomsState,
  state => state.activeChatroom
);

export const getChatroom = (chatId: string) =>
  createSelector(
    getChatroomsState,
    state => state.chatrooms[chatId]
  );

export const getActiveChatroom = createSelector(
  getChatroomsState,
  state => state.chatrooms[state.activeChatroom]
);

export const getChatroomMessages = (chatId: string) =>
  createSelector(
    getChatroom(chatId),
    chatroom => {
      if (!chatroom) return [];
      return chatroom.messages;
    }
  );
