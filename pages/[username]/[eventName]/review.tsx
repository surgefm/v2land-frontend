import React from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

import { EventHead } from '@Components';
import { ComparisonView } from '@Components/Comparison';
import {
  getEvent,
  getEventOwner,
  canCurrentClientViewEvent,
  isLoggedIn,
} from '@Selectors';
import { UtilService } from '@Services';
import { EventActions } from '@Actions';
import { IEventReviewPage, ReduxNextPageContext } from '@Interfaces';

const EventReviewPage: NextPage<IEventReviewPage.IProps, IEventReviewPage.InitialProps> = ({
  eventId: id,
}) => {
  const eventId = -Math.abs(id);
  const event = useSelector(getEvent(eventId));
  const owner = useSelector(getEventOwner(eventId));
  const canView = useSelector(canCurrentClientViewEvent(eventId));
  const loggedIn = useSelector(isLoggedIn);
  const router = useRouter();

  if (!canView) {
    if (typeof window !== 'undefined') {
      const eventPath = event
        ? `/@${owner ? owner.username : event.ownerId}/${Math.abs(event.id)}-${(event as any).pinyin}`
        : '/';
      UtilService.redirect(eventPath);
    }
    return <div />;
  }

  if (!event) return <div />;

  const absEventId = Math.abs(id);

  return (
    <>
      <EventHead eventId={eventId} title="Review Changes" />
      <ComparisonView
        baseEventId={absEventId}
        targetEventId={-absEventId}
        baseLabel="Committed"
        targetLabel="Draft"
      />
    </>
  );
};

EventReviewPage.getInitialProps = async (
  ctx: ReduxNextPageContext
): Promise<IEventReviewPage.InitialProps> => {
  // Fetch the draft (latest) version — this also handles login check and redirects
  const eventId =
    (await UtilService.getEventIdMiddleware(ctx, '/review', { needViewPermission: true })) || 0;

  if (eventId !== 0) {
    // Also fetch the committed (public) version for comparison
    const absId = Math.abs(eventId);
    await ctx.store.dispatch(
      EventActions.GetEvent(absId, ctx.query.username as string, false)
    );
  }

  return {
    namespacesRequired: ['common'],
    eventId,
  };
};

export default EventReviewPage;
