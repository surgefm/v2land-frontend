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
import { getEvent, getEventStackIdList } from '@Selectors';
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
  const eventId = (await UtilService.getEventIdMiddleware(ctx)) || 0;

  return {
    namespacesRequired: ['common'],
    eventId,
  };
};

export default withTranslation('common')(EventPage);
