import { ChatroomsState } from '@Interfaces';

const updateMessagesLastReadBy = (state: ChatroomsState, chatId: string): ChatroomsState => {
  const chatroom = state.chatrooms[chatId];
  if (!chatroom) return state;
  const { messages } = chatroom;
  const newMessages = [];
  const membersWithLastRead = new Set(chatroom.members.filter(m => m.lastRead));
  for (let i = 0; i < messages.length; i += 1) {
    const message = { ...messages[i], lastReadBy: [] as number[] };
    const members = Array.from(membersWithLastRead);
    for (let j = 0; j < members.length; j += 1) {
      const member = members[j];
      if (message.createdAt <= (member.lastRead as string)) {
        membersWithLastRead.delete(member);
        if (message.authorId !== member.clientId) {
          message.lastReadBy.push(member.clientId);
        }
      }
    }
    newMessages.push(message);
  }

  return {
    ...state,
    chatrooms: {
      [chatId]: {
        ...chatroom,
        messages: newMessages,
      },
    },
  };
};

export default updateMessagesLastReadBy;
