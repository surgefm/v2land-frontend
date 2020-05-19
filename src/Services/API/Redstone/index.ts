// #region Local Imports
import { get, post, put } from '@Services/API/Http';
import { Event, News, Client } from '@Interfaces';
import { RedstoneModel } from './Redstone';
// #endregion Local Imports

export const getEvent = async (eventId: number, getLatest = false): Promise<Event> => {
  return get<Event>(`/event/${eventId}`, { latest: getLatest ? 1 : 0 });
};

export const getEventList = async (): Promise<Event[]> => {
  const { eventList } = await get<RedstoneModel.GetEventListResponse>('/event');
  return eventList;
};

export const login = async (usernameOrEmail: string, password: string) => {
  return post<RedstoneModel.ClientLogInResponse>('/client/login', {
    username: usernameOrEmail,
    password,
  });
};

export const getClientInfo = async () => {
  return get<{ client: Client }>('/client/me');
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
