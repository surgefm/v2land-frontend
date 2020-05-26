// #region Global Imports
import * as React from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
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
import { getEvent, getEventId, getEventStackIdList } from '@Selectors';
import { UtilService } from '@Services';
// #endregion Local Imports

// #region Interface Imports
import { IEventPage, ReduxNextPageContext } from '@Interfaces';
// #endregion Interface Imports

const EventPage: NextPage<IEventPage.IProps, IEventPage.InitialProps> = () => {
  const router = useRouter();
  const username = router.query.username as string;
  const eventName = router.query.eventName as string;
  const eventId = useSelector(getEventId(username, eventName));
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
  const eventName = ctx.query.eventName as string;
  let username = ctx.query.username as string;
  if (username.startsWith('@')) {
    username = username.slice(1);
  }
  await ctx.store.dispatch(EventActions.GetEvent(eventName, username as string));
  const eventId = getEventId(username, eventName)(ctx.store.getState());
  const event = getEvent(eventId)(ctx.store.getState());
  if (!event) {
    UtilService.redirect(ctx, '/', { hiddenQuery: { event_not_found: 1 } });
  }

  return { namespacesRequired: ['common'] };
};

export default withTranslation('common')(EventPage);
