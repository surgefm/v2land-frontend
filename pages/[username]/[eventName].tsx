// #region Global Imports
import * as React from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import io from 'socket.io-client';
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
import { getEvent, getEventStackIdList } from '@Selectors';
import { RedstoneService } from '@Services';
// #endregion Local Imports

// #region Interface Imports
import { IEventPage, ReduxNextPageContext } from '@Interfaces';
// #endregion Interface Imports

const EventPage: NextPage<IEventPage.IProps, IEventPage.InitialProps> = () => {
  const router = useRouter();
  const event = useSelector(getEvent(+router.query.eventName));
  const stackIdList = useSelector(getEventStackIdList(+router.query.eventName));
  // const dispatch = useDispatch();
  // if (!event) return <div />;

  // dispatch(EventActions.GetEvent(event.id));
  RedstoneService.login('计量经济学家的AI', '666').then(() => {
    const socket = io('http://localhost:1337');
    socket.on('heyo', (data: any) => console.log(data));
    socket.emit('hey', (data: any) => console.log(data));
  });

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
  const { eventName } = ctx.query;

  if (!getEvent(+eventName)(ctx.store.getState())) {
    await ctx.store.dispatch(EventActions.GetEvent(+eventName));
  } else {
    ctx.store.dispatch(EventActions.GetEvent(+eventName));
  }

  return { namespacesRequired: ['common'] };
};

export default withTranslation('common')(EventPage);
