import { NewsroomsState, NewsroomAction } from '@Interfaces';

const setIndividualStackNewsVisible = (
  state: NewsroomsState,
  action: NewsroomAction
): NewsroomsState => {
  return {
    ...state,
    stackNewsVisibility: {
      ...state.stackNewsVisibility,
      [Math.abs(action.stackId as number)]:
        action.visible ||
        state.stackNewsVisibility[Math.abs(action.stackId as number)] ||
        state.showStackNews,
    },
  };
};

export default setIndividualStackNewsVisible;
