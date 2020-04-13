// #region Global Imports
import * as React from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
// #endregion Global Imports

// #region Local Imports
import { withTranslation } from '@Server/i18n';
import { Footer, Card, EventTitle, EventStats, EventDescription } from '@Components';
import { Center } from '@Styled/App';
import { EventActions } from '@Actions';
import { getEvent } from '@Selectors';
// #endregion Local Imports

// #region Interface Imports
import { IEventPage, ReduxNextPageContext } from '@Interfaces';
// #endregion Interface Imports

const EventPage: NextPage<IEventPage.IProps, IEventPage.InitialProps> = () => {
  const router = useRouter();
  const event = useSelector(getEvent(+router.query.eventName));

  return (
    <Center>
      <Card>
        <EventTitle>{event.name}</EventTitle>
        <EventStats newsCount={event.newsCount} stackCount={event.stackCount} />
        <EventDescription description={event.description} />
      </Card>
      <Footer />
    </Center>
  );
};

EventPage.getInitialProps = async (ctx: ReduxNextPageContext): Promise<IEventPage.InitialProps> => {
  const { eventName } = ctx.query;

  await ctx.store.dispatch(EventActions.GetEvent(+eventName));

  return { namespacesRequired: ['common'] };
};

export default withTranslation('common')(EventPage);
