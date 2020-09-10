// #region Local Imports
import { ActionConsts } from '@Definitions';
import { Tag } from '@Interfaces';
// #endregion Local Imports

export const TagActions = {
  AddTag: (tag: Tag) => ({
    tag,
    type: ActionConsts.Tag.AddTag,
  }),

  UpdateTag: (tagId: number, tag: Tag) => ({
    tagId,
    tag,
    type: ActionConsts.Tag.UpdateTag,
  }),

  AddEventToTag: (tagId: number, eventId: number) => ({
    tagId,
    eventId,
    type: ActionConsts.Tag.AddEventToTag,
  }),

  RemoveEventFromTag: (tagId: number, eventId: number) => ({
    tagId,
    eventId,
    type: ActionConsts.Tag.RemoveEventFromTag,
  }),
};
