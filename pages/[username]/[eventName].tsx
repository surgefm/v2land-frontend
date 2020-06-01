// #region Global Imports
import React, { useEffect } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { message } from 'antd';
// #endregion Global Imports

// #region Local Imports
import { withTranslation } from '@Server/i18n';
import {
  Background,
  EventHead,
  Footer,
  Card,
  EventTitle,
  EventStats,
  EventDescription,
  EventContributorList,
  Stack,
  Share,
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
  const router = useRouter();

  useEffect(() => {
    if (router.query.client_not_authorized) {
      message.error('你没有进入该事件新闻编辑室的权限');
      const index = router.asPath.indexOf('?');
      if (index >= 0) {
        UtilService.replace(router.asPath.slice(0, index), { shallow: true });
      } else {
        UtilService.replace(router.asPath, { shallow: true });
      }
    }
  }, [router.query.client_not_authorized]);

  if (!event) return <div />;

  return (
    <Background>
      <EventHead eventId={eventId} />
      <Card>
        <EventTitle>{event.name}</EventTitle>
        <EventStats newsCount={event.newsCount} stackCount={event.stackCount} />
        <EventDescription description={event.description || ''} />
        <div className="bottom">
          <EventContributorList eventId={event.id} />
          <Share event={event} />
        </div>
      </Card>
      {stackIdList.map((stackId, index) => (
        <Stack stackId={stackId} isLatestStack={index === 0} key={`stack-${stackId}`} />
      ))}
      <Footer />
      <style jsx>
        {`
          .bottom {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 0.5rem;
          }
        `}
      </style>
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
