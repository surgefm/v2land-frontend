// #region Global Imports
import { Dispatch } from 'redux';
import { batchActions } from 'redux-batched-actions';
// #endregion Global Imports

// #region Local Imports
import { ActionConsts } from '@Definitions';
import { Action, Event, IStore } from '@Interfaces';
import { RedstoneService } from '@Services';
import { isLoading } from '@Selectors';

import { LoadingActions } from '../LoadingActions';
import { NewsActions } from '../NewsActions';
import { StackActions } from '../StackActions';
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

const AddNewsToEvent = (
  eventId: number,
  newsId: number,
  stackIdOrIsInTemporaryStack?: number | boolean
) => ({
  eventId,
  newsId,
  stackId:
    typeof stackIdOrIsInTemporaryStack === 'number' ? stackIdOrIsInTemporaryStack : undefined,
  isInTemporaryStack:
    typeof stackIdOrIsInTemporaryStack === 'boolean' ? stackIdOrIsInTemporaryStack : undefined,
  type: ActionConsts.Event.AddNewsToEvent,
});

const GetEvent = (eventId: number) => async (dispatch: Dispatch, state: IStore) => {
  const identifier = `event-${eventId}`;
  if (isLoading(identifier)(state)) return;

  dispatch(LoadingActions.BeginLoading(identifier));
  const event = await RedstoneService.getEvent(eventId);
  dispatch(AddEvent(event));

  const actions: Action[] = [];
  event.stacks = event.stacks || [];
  for (let i = 0; i < event.stacks.length; i += 1) {
    const stack = event.stacks[i];
    actions.push(StackActions.AddStack(stack));
    actions.push(AddStackToEvent(eventId, stack.id));

    const newsList = stack.news || [];
    for (let j = 0; j < newsList.length; j += 1) {
      const news = newsList[j];
      actions.push(NewsActions.AddNews(news));
      actions.push(AddNewsToEvent(eventId, news.id, stack.id));
    }
  }

  const temporaryStack = event.temporaryStack || [];
  for (let i = 0; i < temporaryStack.length; i += 1) {
    const news = temporaryStack[i];
    actions.push(NewsActions.AddNews(news));
    actions.push(AddNewsToEvent(eventId, news.id));
  }

  actions.push(LoadingActions.FinishLoading(identifier));

  dispatch(batchActions(actions));
};

export const EventActions = {
  AddEvent,
  GetEvent,
  UpdateEvent,
  AddStackToEvent,
  AddNewsToEvent,
};
