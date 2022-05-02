import { DropResult } from 'react-beautiful-dnd';

import { AppStore } from '@Interfaces';
import { NewsroomActions } from '@Actions';
import { getNewsroomPanels } from '@Selectors';

export async function handlePanelDragEnd(result: DropResult, store: AppStore) {
  const { destination, source } = result;
  if (destination === source || !destination) return;
  let panels = [...getNewsroomPanels(store.getState())];
  const panel = panels[source.index];
  panels = [...panels.slice(0, source.index), ...panels.slice(source.index + 1)];
  panels = [...panels.slice(0, destination.index), panel, ...panels.slice(destination.index)];
  store.dispatch(NewsroomActions.SetPanelsOrder(panels));
}
