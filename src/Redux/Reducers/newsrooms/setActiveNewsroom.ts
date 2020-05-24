import { NewsroomsState, NewsroomAction } from '@Interfaces';

const setActiveNewsroom = (state: NewsroomsState, action: NewsroomAction) => {
  return {
    ...state,
    activeNewsroom: -Math.abs(action.eventId || 0),
  };
};

export default setActiveNewsroom;
