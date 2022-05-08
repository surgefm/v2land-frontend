import { ChatroomsState, ChatroomAction } from '@Interfaces';
import updateMessagesLastReadBy from './updateMessagesLastReadBy';

const addMember = (state: ChatroomsState, action: ChatroomAction): ChatroomsState => {
  if (!action.chatId || !action.clientId || !action.lastRead) return state;
  const { chatId, clientId, lastRead } = action;
  const chatroom = state.chatrooms[chatId];
  if (!chatroom) return state;

  const { members } = chatroom;
  const memberIdx = members.findIndex(m => m.clientId === clientId);
  const member =
    memberIdx >= 0
      ? members[memberIdx]
      : {
          clientId,
          lastRead,
        };

  const newState = {
    ...state,
    chatrooms: {
      ...state.chatrooms,
      [chatId]: {
        ...chatroom,
        members:
          memberIdx >= 0
            ? [
                ...members.slice(0, memberIdx),
                {
                  ...member,
                  lastRead,
                },
                ...members.slice(memberIdx + 1),
              ]
            : [...members, member],
      },
    },
  };
  return updateMessagesLastReadBy(newState, chatId);
};

export default addMember;
