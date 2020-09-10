import { NewsroomsState, NewsroomAction } from '@Interfaces';

const setStackNewsVisible = (state: NewsroomsState, action: NewsroomAction) => {
  const stackNewsVisibility = { ...state.stackNewsVisibility };
  const keys = Object.keys(stackNewsVisibility);
  for (let i = 0; i < keys.length; i += 1) {
    stackNewsVisibility[+keys[i]] = !!action.visible;
  }

  return {
    ...state,
    showStackNews: action.visible || state.showStackNews,
    stackNewsVisibility,
  };
};

export default setStackNewsVisible;
