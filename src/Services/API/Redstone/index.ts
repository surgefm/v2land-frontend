// #region Local Imports
import { get, post, put } from '@Services/API/Http';
import { Event, News } from '@Interfaces';
import { RedstoneModel } from './Redstone';
// #endregion Local Imports

export const getEvent = async (eventId: number): Promise<Event> => {
  return get<Event>(`/event/${eventId}`);
};

export const getEventList = async (): Promise<Event[]> => {
  const { eventList } = await get<RedstoneModel.GetEventListResponse>('/event');
  return eventList;
};

export const getNews = async (newsId: number): Promise<News> => {
  return get<News>(`/news/${newsId}`);
};

export const updateNews = async (
  newsId: number,
  data: RedstoneModel.UpdateNewsOptions
): Promise<RedstoneModel.UpdateNewsResponse> => {
  return put<RedstoneModel.UpdateNewsResponse>(`/news/${newsId}`, data);
};

export const createNews = async (
  data: RedstoneModel.CreateNewsOptions
): Promise<RedstoneModel.CreateNewsResponse> => {
  return post<RedstoneModel.CreateNewsResponse>('/news', data);
};

export const login = async (username: string, password: string): Promise<any> => {
  return post<any>('/client/login', { username, password });
};
