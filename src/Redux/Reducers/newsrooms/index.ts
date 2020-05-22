// #region Local Imports
import { ActionConsts } from '@Definitions';
// #endregion Local Imports

// #region Interface Imports
import { NewsroomAction, NewsroomsState } from '@Interfaces';
// #endregion Interface Imports

const INITIAL_STATE: NewsroomsState = {
  panels: ['event-information', 'offshelf-news-list', 'offshelf-stack-list', 'stack-list'],
};

export const NewsroomReducer = (state = INITIAL_STATE, action: NewsroomAction) => {
  switch (action.type) {
    case ActionConsts.Newsroom.SetPanelsOrder: {
      return {
        ...state,
        panels: action.panels || state.panels,
      };
    }
    default:
      return state;
  }
};
