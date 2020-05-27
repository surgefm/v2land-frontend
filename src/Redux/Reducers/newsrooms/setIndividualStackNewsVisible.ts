import { NewsroomsState, NewsroomAction } from '@Interfaces';

const setIndividualStackNewsVisible = (state: NewsroomsState, action: NewsroomAction) => {
  return {
    ...state,
    stackNewsVisibility: {
      ...state.stackNewsVisibility,
      [Math.abs(action.stackId as number)]: action.visible,
    },
  };
};

export default setIndividualStackNewsVisible;
