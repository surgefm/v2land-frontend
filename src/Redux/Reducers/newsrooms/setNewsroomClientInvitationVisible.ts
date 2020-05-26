import { NewsroomsState, NewsroomAction } from '@Interfaces';

const setNewsroomClientInvitationVisible = (state: NewsroomsState, action: NewsroomAction) => {
  if (action.visible === state.showClientInvitation) return state;
  if (typeof action.visible === 'undefined') return state;
  return {
    ...state,
    showClientInvitation: action.visible,
  };
};

export default setNewsroomClientInvitationVisible;
