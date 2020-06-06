import { NewsroomsState, NewsroomAction } from '@Interfaces';

const setIndividualStackNewsVisible = (
  state: NewsroomsState,
  action: NewsroomAction
): NewsroomsState => {
  let visibility = action.visible;
  if (typeof visibility === 'undefined') {
    visibility = state.stackNewsVisibility[Math.abs(action.stackId as number)];
  }
  if (typeof visibility === 'undefined') {
    visibility = state.showStackNews;
  }

  return {
    ...state,
    stackNewsVisibility: {
      ...state.stackNewsVisibility,
      [Math.abs(action.stackId as number)]: visibility,
    },
  };
};

export default setIndividualStackNewsVisible;
