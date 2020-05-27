import { ReduxNextPageContext } from '@Interfaces';
import { EventActions } from '@Actions';
import {
  isLoggedIn,
  getEvent,
  getEventId,
  getEventOwner,
  canCurrentClientViewEvent,
} from '@Selectors';

import { redirect, replace } from './redirect';

export const getEventIdMiddleware = async (
  ctx: ReduxNextPageContext,
  path = '',
  options = {
    needViewPermission: false,
  }
): Promise<number | null> => {
  if (options.needViewPermission) {
    const loggedIn = isLoggedIn(ctx.store.getState());
    if (!loggedIn) {
      redirect(ctx, encodeURI(`/login?redirect=${ctx.asPath}`));
      return null;
    }
  }

  const eventName = ctx.query.eventName as string;
  const split = eventName.split('-');
  const eid = +split[0];
  const id = eid === eid ? eid : eventName;
  const pinyin = split.slice(1).join('-');

  let username = ctx.query.username as string;
  if (username.startsWith('@')) {
    username = username.slice(1);
  }

  await ctx.store.dispatch(
    EventActions.GetEvent(id, username as string, options.needViewPermission)
  );
  let eventId = getEventId(username, id)(ctx.store.getState());
  eventId = options.needViewPermission ? -Math.abs(eventId) : Math.abs(eventId);
  const event = getEvent(eventId)(ctx.store.getState());
  const owner = getEventOwner(eventId)(ctx.store.getState());
  if (!event) {
    redirect(ctx, '/', { hiddenQuery: { event_not_found: 1 } });
    return null;
  }
  const base = `/@${owner ? owner.username : username}/${Math.abs(eventId)}-${event.pinyin ||
    pinyin}`;
  if (options.needViewPermission && !canCurrentClientViewEvent(event.id)) {
    redirect(ctx, base, { hiddenQuery: { client_not_authorized: 1 } });
    return null;
  }
  if ((event.pinyin && pinyin !== event.pinyin) || (owner && owner.username !== username)) {
    replace(ctx, `${base}${path}`, { permanent: true });
    return null;
  }

  return eventId;
};
