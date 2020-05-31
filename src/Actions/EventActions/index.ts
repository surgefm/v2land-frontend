// #region Global Imports
import { Dispatch } from 'redux';
import { batchActions } from 'redux-batched-actions';
// #endregion Global Imports

// #region Local Imports
import { ActionConsts } from '@Definitions';
import { Action, Event, IThunkStore } from '@Interfaces';
import { RedstoneService, getState } from '@Services';
import { isLoading } from '@Selectors';

import { LoadingActions } from '../LoadingActions';
import { NewsActions } from '../NewsActions';
import { StackActions } from '../StackActions';
import { ClientActions } from '../ClientActions';
import { NewsroomActions } from '../NewsroomActions';
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
  } catch (err) {
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

  if (event.roles) {
    actions.push(
      NewsroomActions.AddNewsroom({
        eventId: event.id,
        roles: event.roles,
      })
    );
  }

  event.stacks = event.stacks || [];
  for (let i = 0; i < event.stacks.length; i += 1) {
    const stack = event.stacks[i];
    stack.id = getId(stack.id, getLatest);
    stack.eventId = id;
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

  const temporaryStack = event.temporaryStack || [];
  for (let i = 0; i < temporaryStack.length; i += 1) {
    const news = temporaryStack[i];
    news.id = getId(news.id, getLatest);
    actions.push(NewsActions.AddNews(news));
    actions.push(AddNewsToEventOffshelfNewsList(id, news.id));
  }

  actions.push(LoadingActions.FinishLoading(identifier));

  dispatch(batchActions(actions));
};

export const EventActions = {
  AddEvent,
  GetEvent,
  UpdateEvent,
  UpdateEventStackListOrder,
  UpdateEventOffshelfStackListOrder,
  AddStackToEvent,
  AddStackToEventOffshelfStackList,
  AddNewsToEvent,
  AddNewsToEventOffshelfNewsList,
  RemoveNewsFromEvent,
};
