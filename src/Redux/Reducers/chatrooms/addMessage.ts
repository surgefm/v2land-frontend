import { ChatroomsState, ChatroomAction, ChatMessage } from '@Interfaces';
import updateMessagesLastReadBy from './updateMessagesLastReadBy';

const sortMessages = (sortedMessages: ChatMessage[], message: ChatMessage): ChatMessage[] => {
  if (sortedMessages.length === 0) return [message];
  if (sortedMessages[0].createdAt < message.createdAt) {
    return [message, ...sortedMessages];
  }

  let begin = 0;
  let end = sortedMessages.length;
  let mid = Math.floor((begin + end) / 2);
  while (begin < end) {
    if (sortedMessages[mid].createdAt < message.createdAt) {
      end = mid;
    } else {
      begin = mid;
    }
    if (begin === end - 1) break;
    mid = Math.floor((begin + end) / 2);
  }

  return [...sortedMessages.slice(0, end), message, ...sortedMessages.slice(end)];
};

const addMessage = (state: ChatroomsState, action: ChatroomAction) => {
  if (!action.chatId || !action.message) return state;
  const { chatId, message } = action;
  if (!state.chatrooms[chatId]) return state;
  const chatroom = state.chatrooms[chatId];

  const { messages, messageIds } = chatroom;
  if (messageIds[message.id]) return state;

  const newState = {
    ...state,
    chatrooms: {
      ...state.chatrooms,
      [chatId]: {
        ...chatroom,
        messages: sortMessages(messages, message),
        messageIds: {
          ...chatroom.messageIds,
          [message.id]: 1,
        },
      },
    },
  };

  return updateMessagesLastReadBy(newState, chatId);
};

export default addMessage;
