// #region Local Imports
import { get, post, put, del } from '@Services/API/Http';
import { Event, News, Client, Tag, InviteCode, PopularChatroom } from '@Interfaces';
import { RedstoneModel } from './Redstone';
// #endregion Local Imports

export const getEvent = async (
  eventId: number | string,
  username: string | boolean = false,
  getLatest = false
): Promise<Event> => {
  return typeof username === 'string'
    ? get<Event>(`/event/@${username}/${eventId}`, {
        latest: getLatest ? 1 : 0,
      })
    : get<Event>(`/event/${+eventId}`, { latest: username ? 1 : 0 });
};

type GetEventListOptions = {
  page?: number;
  where?: any;
  latest?: boolean;
};

export const getEventList = async ({
  page = 1,
  where = {},
  latest = false,
}: GetEventListOptions): Promise<Event[]> => {
  const { eventList } = await post<RedstoneModel.GetEventListResponse>('/event/list', {
    page,
    where,
    latest: latest ? 1 : 0,
  });
  return eventList;
};

export const login = async (usernameOrEmail: string, password: string) => {
  return post<RedstoneModel.ClientLogInResponse>('/client/login', {
    username: usernameOrEmail,
    password,
  });
};

export const register = async (
  username: string,
  nickname: string,
  email: string,
  password: string,
  inviteCode?: string
) => {
  return post<RedstoneModel.ClientLogInResponse>('/client/register', {
    username,
    password,
    nickname,
    email,
    inviteCode: inviteCode || '',
  });
};

export const logout = async () => {
  return get('/client/logout');
};

export const createEvent = async (data: RedstoneModel.CreateEventOptions) => {
  return post<RedstoneModel.CreateEventResponse>('/event', data);
};

export const getClientInfo = async () => {
  return get<{ client: Client }>('/client/me');
};

export const getClient = async (clientId: number | string) => {
  return get<{ client: Client }>(`/client/${clientId}`);
};

export const updateClient = async (clientId: number, data: RedstoneModel.UpdateClientOptions) => {
  return put<RedstoneModel.UpdateClientResponse>(`/client/${clientId}`, data);
};

export const findClients = async (usernameFragment: string) => {
  return post<{ clientList: Client[] }>('/client', {
    where: { username: { startsWith: usernameFragment } },
  });
};

export const getNews = async (newsId: number): Promise<News> => {
  return get<News>(`/news/${newsId}`);
};

export const updateNews = async (newsId: number, data: RedstoneModel.UpdateNewsOptions) => {
  return put<RedstoneModel.UpdateNewsResponse>(`/news/${newsId}`, data);
};

export const createNews = async (
  eventId: string,
  data: RedstoneModel.CreateNewsOptions
): Promise<RedstoneModel.CreateNewsResponse> => {
  return post<RedstoneModel.CreateNewsResponse>(`/event/${eventId}/news`, data);
};

export const addTag = async (eventId: number, tagId: number) => {
  return post(`/event/${eventId}/tag`, { tag: tagId });
};

export const removeTag = async (eventId: number, tagId: number) => {
  return del(`/event/${eventId}/tag/${tagId}`);
};

export const createTag = async (name: string, description = '') => {
  return post<RedstoneModel.CreateTagResponse>('/tag', { name, description });
};

export const updateTag = async (tagId: number, options: RedstoneModel.UpdateTagOptions) => {
  return put<RedstoneModel.UpdateTagResposne>(`/tag/${tagId}`, options);
};

export const addTagCurator = async (tagId: number, curatorId: number) => {
  return post<RedstoneModel.AddTagCuratorResponse>(`/tag/${tagId}/curator`, { curatorId });
};

export const removeTagCurator = async (tagId: number, curatorId: number) => {
  return del<RedstoneModel.RemoveCuratorResponse>(`/tag/${tagId}/curator/${curatorId}`);
};

type GetTagListOptions = {
  page?: number;
  where?: any;
};

export const getTagList = async ({ page = 1, where = {} }: GetTagListOptions = {}) => {
  const { tags, count } = await post<RedstoneModel.GetTagListResponse>('/tag/list', {
    page,
    where,
  });
  return { tags, count };
};

export const getTag = async (tagId: number | string): Promise<Tag> => {
  const { tag } = await get<RedstoneModel.GetTagResponse>(`/tag/${tagId}`);
  return tag;
};

export const getInviteCodes = async (): Promise<InviteCode[]> => {
  const { invites } = await get<RedstoneModel.GetInviteCodesResponse>('/client/inviteCode');
  return invites;
};

export const getPopularChatrooms = async (): Promise<PopularChatroom[]> => {
  const { chatrooms } = await get<RedstoneModel.GetPopularChatroomsResponse>('/chat');
  return chatrooms;
};

export const loadChatMessages = async (
  type: 'client' | 'newsroom',
  ids: number | number[],
  before?: Date
) => {
  const { messages } = await post<RedstoneModel.LoadChatMessagesResponse>('/chat/messages', {
    type,
    ids,
    before: before ? before.toISOString() : new Date(Date.now() + 100000).toISOString(),
  });
  return messages;
};

export const getTagListStats = async () => {
  const { tagListStats } = await get<RedstoneModel.GetTagListStatsResponse>('/tag/stats');
  return tagListStats;
};

export const getTagListByAlphabet = async (letter: string) => {
  const { tags } = await get<RedstoneModel.GetTagListResponse>(`/tag/list/${letter}`);
  return tags;
};

export const getAllTags = async () => {
  const { allTags } = await get<RedstoneModel.GetAllTagsResponse>('/tag/list/all');
  return allTags;
};
