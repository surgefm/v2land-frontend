import { ChatroomsState, ChatroomAction } from '@Interfaces';

const addMessage = (state: ChatroomsState, action: ChatroomAction) => {
  if (!action.chatId || !action.message) return state;
  const { chatId, message } = action;
  if (!state.chatrooms[chatId]) return state;
  const chatroom = state.chatrooms[chatId];

  const { messages, messageIds } = chatroom;
  if (messageIds[message.id]) return state;

  return {
    ...state,
    chatrooms: {
      ...state.chatrooms,
      [chatId]: {
        ...chatroom,
        messages: [...messages, message].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)),
        messageIds: {
          ...chatroom.messageIds,
          [message.id]: 1,
        },
      },
    },
  };
};

export default addMessage;
