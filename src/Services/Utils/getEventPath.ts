import { Event, Client } from '@Interfaces';

export const getEventPath = (event: Event, client?: Client | null) => {
  return `/@${client ? client.username : 'newspect'}/${Math.abs(event.id)}-${event.pinyin}`;
};
