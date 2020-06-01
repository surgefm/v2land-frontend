import { Event, Client } from '@Interfaces';

export const getEventPath = (event?: Event | null, client?: Client | null) => {
  if (!event) return '/';
  return `/@${client ? client.username : 'newspect'}/${Math.abs(event.id)}-${event.pinyin}`;
};
