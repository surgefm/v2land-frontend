import { Event, Client } from '@Interfaces';

export const getEventPath = (event: Event, client?: Client) => {
  return `/@${client ? client.username : 'newspect'}/${event.id}-${event.pinyin}`;
};
