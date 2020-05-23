import { NewsroomsState, NewsroomAction } from '@Interfaces';

const setPanelsOrder = (state: NewsroomsState, action: NewsroomAction) => {
  return {
    ...state,
    panels: action.panels || state.panels,
  };
};

export default setPanelsOrder;
