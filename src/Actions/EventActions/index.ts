// #region Global Imports
import { Dispatch } from 'redux';
import { batchActions } from 'redux-batched-actions';
// #endregion Global Imports

// #region Local Imports
import { ActionConsts } from '@Definitions';
import { Action, Event, IThunkStore } from '@Interfaces';
import { RedstoneService, getState } from '@Services';
import { isLoading, getClient } from '@Selectors';

import { LoadingActions } from '../LoadingActions';
import { HomepageActions } from '../HomepageActions';
import { NewsActions } from '../NewsActions';
import { StackActions } from '../StackActions';
import { ClientActions } from '../ClientActions';
import { NewsroomActions } from '../NewsroomActions';
import { TagActions } from '../TagActions';
// #endregion Local Imports

const AddEvent = (event: Event) => ({
  event,
  type: ActionConsts.Event.AddEvent,
});

const UpdateEvent = (eventId: number, event: Event) => ({
  eventId,
  event,
  type: ActionConsts.Event.UpdateEvent,
});

const AddStackToEvent = (eventId: number, stackId: number) => ({
  eventId,
  stackId,
  type: ActionConsts.Event.AddStackToEvent,
});

const AddStackToEventOffshelfStackList = (eventId: number, stackId: number) => ({
  eventId,
  stackId,
  type: ActionConsts.Event.AddStackToEventOffshelfStackList,
});

const UpdateEventStackListOrder = (eventId: number, stackIdList: number[]) => ({
  eventId,
  stackIdList,
  type: ActionConsts.Event.UpdateEventStackListOrder,
});

const UpdateEventOffshelfStackListOrder = (eventId: number, stackIdList: number[]) => ({
  eventId,
  stackIdList,
  type: ActionConsts.Event.UpdateEventOffshelfStackListOrder,
});

const AddNewsToEvent = (eventId: number, newsId: number, stackId?: number) => ({
  eventId,
  newsId,
  stackId: typeof stackId === 'number' ? stackId : undefined,
  type: ActionConsts.Event.AddNewsToEvent,
});

const RemoveNewsFromEvent = (eventId: number, newsId: number, stackId?: number) => ({
  eventId,
  newsId,
  stackId: typeof stackId === 'number' ? stackId : undefined,
  type: ActionConsts.Event.RemoveNewsFromEvent,
});

const AddNewsToEventOffshelfNewsList = (eventId: number, newsId: number) => ({
  eventId,
  newsId,
  type: ActionConsts.Event.AddNewsToEventOffshelfNewsList,
});

const SortEventOffshelfStackList = (eventId: number) => ({
  eventId,
  type: ActionConsts.Event.SortEventOffshelfStackList,
});

const SortEventStackList = (eventId: number) => ({
  eventId,
  type: ActionConsts.Event.SortEventStackList,
});

const getId = (id: number, getLatest = false) => {
  return getLatest ? -Math.abs(id) : Math.abs(id);
};

const GetEvent = (
  eventId: number | string,
  username: string | boolean = false,
  getLatest = false
) => async (dispatch: Dispatch, state: IThunkStore) => {
  const identifier = `event-${eventId}-${username}-${getLatest ? 1 : 0}`;
  if (isLoading(identifier)(getState(state))) return;

  dispatch(LoadingActions.BeginLoading(identifier));
  let event: Event | undefined;
  try {
    event =
      typeof eventId === 'number'
        ? await RedstoneService.getEvent(Math.abs(eventId), username, getLatest)
        : await RedstoneService.getEvent(eventId, username, getLatest);
  } catch (e) {
    const err = e as any;
    if (err.status === 401) {
      // eslint-disable-next-line prefer-destructuring
      event = (await err.json()).event;
    } else {
      dispatch(LoadingActions.FinishLoading(identifier));
      return;
    }
  }
  event = (event as any) as Event;
  const id = getId(event.id, getLatest);
  event.id = id;

  dispatch(AddEvent(event));

  const actions: Action[] = [];

  if (event.owner) {
    actions.push(ClientActions.AddClient(event.owner));
  }

  if (event.contributorIdList) {
    const clientIds: number[] = [];
    const promises: Promise<void>[] = [];
    for (let i = 0; i < event.contributorIdList.length; i += 1) {
      const clientId = event.contributorIdList[i];
      if (!clientIds.includes(clientId)) {
        clientIds.push(clientId);
        if (!getClient(clientId)(getState(state))) {
          promises.push(ClientActions.GetClient(clientId)(dispatch, state));
        }
      }
    }
    await Promise.all(promises);
  }

  if (event.roles) {
    actions.push(
      NewsroomActions.AddNewsroom({
        eventId: event.id,
        roles: event.roles,
      })
    );
  }

  event.tags = event.tags || [];
  for (let i = 0; i < event.tags.length; i += 1) {
    const tag = event.tags[i];
    actions.push(TagActions.AddSingleTag(tag));
    actions.push(TagActions.AddEventToTag(tag.id, id));
  }

  event.stacks = event.stacks || [];
  for (let i = 0; i < event.stacks.length; i += 1) {
    const stack = event.stacks[i];
    stack.id = getId(stack.id, getLatest);
    stack.eventId = id;

    if (stack.stackEventId && stack.stackEvent) {
      actions.push(AddEvent({ ...stack.stackEvent }));
      delete stack.stackEvent;
    }

    actions.push(StackActions.AddStack(stack));
    if ((stack.order || 0) >= 0) {
      actions.push(AddStackToEvent(id, stack.id));
    } else {
      actions.push(AddStackToEventOffshelfStackList(id, stack.id));
    }

    const newsList = stack.news || [];
    for (let j = 0; j < newsList.length; j += 1) {
      const news = newsList[j];
      news.id = getId(news.id, getLatest);
      actions.push(NewsActions.AddNews(news));
      actions.push(AddNewsToEvent(id, news.id, stack.id));
    }
  }

  const offshelfNews = event.offshelfNews || [];
  for (let i = 0; i < offshelfNews.length; i += 1) {
    const news = offshelfNews[i];
    news.id = getId(news.id, getLatest);
    actions.push(NewsActions.AddNews(news));
    actions.push(AddNewsToEventOffshelfNewsList(id, news.id));
  }

  actions.push(LoadingActions.FinishLoading(identifier));

  dispatch(batchActions(actions));
};

const GetEventList = (page = 1) => async (dispatch: Dispatch, state: IThunkStore) => {
  const identifier = `event-list-${page}`;
  if (isLoading(identifier)(getState(state))) return;

  dispatch(LoadingActions.BeginLoading(identifier));
  const eventList = await RedstoneService.getEventList({ page });

  const actions: Action[] = eventList.map(AddEvent);
  for (let i = 0; i < eventList.length; i += 1) {
    const tags = eventList[i].tags || [];
    for (let j = 0; j < tags.length; j += 1) {
      actions.push(TagActions.AddSingleTag(tags[j]));
    }
  }

  actions.push(HomepageActions.SetEventList(eventList.map(event => event.id), page));
  const clientIds: number[] = [];
  const promises: Promise<void>[] = [];
  for (let i = 0; i < eventList.length; i += 1) {
    const clientId = eventList[i].ownerId;
    if (clientIds.indexOf(clientId) < 0) {
      clientIds.push(clientId);
      if (!getClient(clientId)(getState(state))) {
        promises.push(ClientActions.GetClient(clientId)(dispatch, state));
      }
    }
  }
  await Promise.all(promises);

  actions.push(LoadingActions.FinishLoading(identifier));

  dispatch(batchActions(actions));
};

export const EventActions = {
  AddEvent,
  GetEvent,
  GetEventList,
  UpdateEvent,
  UpdateEventStackListOrder,
  UpdateEventOffshelfStackListOrder,
  AddStackToEvent,
  AddStackToEventOffshelfStackList,
  AddNewsToEvent,
  AddNewsToEventOffshelfNewsList,
  SortEventStackList,
  SortEventOffshelfStackList,
  RemoveNewsFromEvent,
};
