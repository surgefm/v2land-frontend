import { createSelector } from 'reselect';
import { IStore } from '@Interfaces';

export const getNewsState = (state: IStore) => state.news;

export const getNews = (newsId: number) =>
  createSelector(
    getNewsState,
    newsState => {
      if (typeof newsState.idIndexMap[newsId] === 'undefined') return null;
      return newsState.list[newsState.idIndexMap[newsId]];
    }
  );

export const getNewsList = (newsIdList: number[], sorted = false) =>
  createSelector(
    getNewsState,
    newsState => {
      const newsList = [];
      for (let i = 0; i < newsIdList.length; i += 1) {
        const newsId = newsIdList[i];
        const index = newsState.idIndexMap[newsId];
        if (typeof index !== 'undefined') {
          newsList.push(newsState.list[index]);
        }
      }
      if (!sorted) return newsList;
      return newsList.sort((a, b) => (a.time > b.time ? 1 : -1));
    }
  );
