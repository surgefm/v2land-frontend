import { ChatroomsState, ChatroomAction } from '@Interfaces';

const setActiveChatroom = (state: ChatroomsState, action: ChatroomAction) => {
  return {
    ...state,
    activeChatroom: action.chatId || '',
  };
};

export default setActiveChatroom;
