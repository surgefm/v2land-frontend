// #region Local Imports
import { ActionConsts } from '@Definitions';
import { News } from '@Interfaces';
// #endregion Local Imports

export const NewsActions = {
  AddNews: (news: News) => ({
    news,
    type: ActionConsts.News.AddNews,
  }),

  UpdateNews: (newsId: number, news: News) => ({
    newsId,
    news,
    type: ActionConsts.News.UpdateNews,
  }),
};
