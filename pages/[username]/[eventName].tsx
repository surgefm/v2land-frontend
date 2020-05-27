// #region Global Imports
import * as React from 'react';
import { NextPage } from 'next';
import { useSelector } from 'react-redux';
// #endregion Global Imports

// #region Local Imports
import { withTranslation } from '@Server/i18n';
import {
  Background,
  Footer,
  Card,
  EventTitle,
  EventStats,
  EventDescription,
  Stack,
} from '@Components';
import { EventActions } from '@Actions';
import { getEvent, getEventId, getEventStackIdList, getEventOwner } from '@Selectors';
import { UtilService } from '@Services';
// #endregion Local Imports

// #region Interface Imports
import { IEventPage, ReduxNextPageContext } from '@Interfaces';
// #endregion Interface Imports

const EventPage: NextPage<IEventPage.IProps, IEventPage.InitialProps> = ({ eventId }) => {
  const event = useSelector(getEvent(eventId));
  const stackIdList = useSelector(getEventStackIdList(eventId));

  if (!event) return <div />;

  return (
    <Background>
      <Card>
        <EventTitle>{event.name}</EventTitle>
        <EventStats newsCount={event.newsCount} stackCount={event.stackCount} />
        <EventDescription description={event.description} />
      </Card>
      {stackIdList.map(stackId => (
        <Stack stackId={stackId} key={`stack-${stackId}`} />
      ))}
      <Footer />
    </Background>
  );
};

EventPage.getInitialProps = async (ctx: ReduxNextPageContext): Promise<IEventPage.InitialProps> => {
  const props = { namespacesRequired: ['common'] };

  const eventName = ctx.query.eventName as string;
  const split = eventName.split('-');
  const eid = +split[0];
  const id = eid === eid ? eid : eventName;
  const pinyin = split.slice(1).join('-');

  let username = ctx.query.username as string;
  if (username.startsWith('@')) {
    username = username.slice(1);
  }

  await ctx.store.dispatch(EventActions.GetEvent(id, username as string));
  const eventId = getEventId(username, id)(ctx.store.getState());
  const event = getEvent(eventId)(ctx.store.getState());
  const owner = getEventOwner(eventId)(ctx.store.getState());
  if (!event) {
    UtilService.redirect(ctx, '/', { hiddenQuery: { event_not_found: 1 } });
    return props;
  }
  if ((event.pinyin && pinyin !== event.pinyin) || (owner && owner.username !== username)) {
    UtilService.replace(
      ctx,
      `/@${owner ? owner.username : username}/${eventId}-${event.pinyin || pinyin}`,
      { permanent: true }
    );
    return props;
  }

  return {
    namespacesRequired: ['common'],
    eventId,
  };
};

export default withTranslation('common')(EventPage);
