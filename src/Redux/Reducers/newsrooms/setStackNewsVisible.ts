import { NewsroomsState, NewsroomAction } from '@Interfaces';

const setStackNewsVisible = (state: NewsroomsState, action: NewsroomAction) => {
  return {
    ...state,
    showStackNews: action.visible,
  };
};

export default setStackNewsVisible;
