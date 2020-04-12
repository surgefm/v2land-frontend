// #region Local Imports
import { ActionConsts } from '@Definitions';
import { Event } from '@Interfaces';
// #endregion Local Imports

export const EventActions = {
  AddEvent: (event: Event) => ({
    event,
    type: ActionConsts.Event.AddEvent,
  }),

  UpdateEvent: (eventId: number, event: Event) => ({
    eventId,
    event,
    type: ActionConsts.Event.UpdateEvent,
  }),

  AddStackToEvent: (eventId: number, stackId: number) => ({
    eventId,
    stackId,
    type: ActionConsts.Event.AddStackToEvent,
  }),

  AddNewsToEvent: (eventId: number, newsId: number, stackId?: number) => ({
    eventId,
    newsId,
    stackId,
    type: ActionConsts.Event.AddNewsToEvent,
  }),
};
