import { ChatroomsState, ChatroomAction } from '@Interfaces';
import updateMessagesLastReadBy from './updateMessagesLastReadBy';

const addMember = (state: ChatroomsState, action: ChatroomAction) => {
  if (!action.chatId || !action.member) return state;
  const { chatId, member } = action;
  if (!state.chatrooms[chatId]) return state;
  const chatroom = state.chatrooms[chatId];

  const { members } = chatroom;
  const memberIdx = members.findIndex(m => m.clientId === member.clientId);
  const newState = {
    ...state,
    chatrooms: {
      ...state.chatrooms,
      [chatId]: {
        ...chatroom,
        members:
          memberIdx >= 0
            ? [...members.slice(0, memberIdx), member, ...members.slice(memberIdx + 1)]
            : [...members, member],
      },
    },
  };

  return updateMessagesLastReadBy(newState, chatId);
};

export default addMember;
