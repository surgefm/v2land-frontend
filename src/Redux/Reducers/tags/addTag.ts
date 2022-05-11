import { TagsState, TagAction } from '@Interfaces';

export default function addTag(state: TagsState, action: TagAction) {
  if (!action.tag) return state;
  const tagId = action.tagId || action.tag.id;
  if (!tagId) return state;
  const { tag } = action;
  if (tag.events) {
    tag.eventIdList = tag.events.map(event => event.id);
    delete tag.events;
  }
  tag.eventIdList = Array.from(new Set(tag.eventIdList)) || [];
  tag.curatorIdList = tag.curators ? tag.curators.map(c => c.id) : undefined;

  const newState = { ...state };
  const index = state.idIndexMap[tagId];
  if (typeof index !== 'undefined') {
    const oldTag = newState.list[index];
    if (oldTag && !tag.description) tag.description = oldTag.description;
    if (oldTag && !tag.curators) tag.curatorIdList = oldTag.curatorIdList || [];
    let newEventIdList = [...((oldTag || {}).eventIdList || []), ...tag.eventIdList];
    newEventIdList = newEventIdList.filter((id, idx) => newEventIdList.indexOf(id) === idx);
    newState.list[index] = {
      ...newState.list[index],
      ...tag,
      eventIdList: newEventIdList,
    };
    return newState;
  }
  newState.idIndexMap[tagId] = newState.list.length;
  newState.nameIdMap[tag.name] = tagId;
  newState.list.push(tag);
  return newState;
}
