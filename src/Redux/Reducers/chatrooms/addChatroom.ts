import { ChatroomsState, ChatroomAction } from '@Interfaces';

const addChatroom = (state: ChatroomsState, action: ChatroomAction): ChatroomsState => {
  if (!action.chatId || !action.chatType || !action.ids) return state;
  const { chatId, chatType, ids } = action;
  if (state.chatrooms[chatId] !== undefined) return state;

  return {
    ...state,
    chatrooms: {
      ...state.chatrooms,
      [chatId]: { id: chatId, type: chatType, ids, messages: [], messageIds: {}, members: [] },
    },
  };
};

export default addChatroom;
