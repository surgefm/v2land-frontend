import { IStore, EventAction } from '@Interfaces';
import { getStackTime } from '@Selectors';

export default function sortEventStackList(store: IStore, action: EventAction) {
  if (!action.eventId) return store;
  const { eventId } = action;
  const state = store.events;
  const index = state.idIndexMap[eventId];
  if (typeof index === 'undefined') return store;
  const event = { ...state.list[index] };

  const list = event.stackIdList.map(id => ({ id, time: getStackTime(id)(store) }));
  list.sort((a, b) => {
    if (!a.time) return -1;
    if (!b.time) return 1;
    return new Date(b.time).getTime() - new Date(a.time).getTime();
  });
  event.stackIdList = list.map(item => item.id);

  return {
    ...store,
    events: {
      ...state,
      list: [...state.list.slice(0, index), event, ...state.list.slice(index + 1)],
    },
  };
}
