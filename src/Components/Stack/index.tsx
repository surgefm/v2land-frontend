import React from 'react';
import { useSelector } from 'react-redux';
import { Element as ScrollElement } from 'react-scroll';

import { getStack, getStackNewsIdList, getStackTime, getEvent, getEventOwner } from '@Selectors';
import { UtilService } from '@Services';
import { useTranslation } from '@I18n';
import { EventCard } from '@Components/EventCard';
import { Card, Time } from '@Components/Basic';
import { Share } from '@Components/Share';

import { IStack } from './Stack';
import { NewsItemList } from './NewsItemList';
import { StackShimmer } from './Shimmer';

export * from './Form';
export * from './Shimmer';
export * from './SideMenu';

const StackImpl: React.FunctionComponent<IStack.IProps> = ({
  stackId,
  isLatestStack = false,
  displayOrder = true,
  showEventName = false,
}) => {
  const { t } = useTranslation('common');
  const stack = useSelector(getStack(stackId));
  const newsIdList = useSelector(getStackNewsIdList(stackId));
  const time = useSelector(getStackTime(stackId));
  const event = useSelector(getEvent(stack ? stack.eventId : 0));
  const owner = useSelector(getEventOwner(stack ? stack.eventId : 0));
  if (!stack) return <StackShimmer />;

  const items = [];
  if (event && owner && showEventName) {
    const path = UtilService.getEventPath(event, owner);
    const handleClick = () => UtilService.redirect(path);
    items.push(
      <a href={path} onClick={handleClick} key="1">{`@${owner.username}/${event.name}`}</a>
    );
  }

  if (isLatestStack) {
    if (items.length > 0)
      items.push(
        <span className="separator" key="2">
          ·
        </span>
      );
    items.push(<span key="3">{t('Stack_Card_LatestStack')}</span>);
  }

  if (time) {
    if (items.length > 0)
      items.push(
        <span className="separator" key="4">
          ·
        </span>
      );
    items.push(<Time time={time} key="5" />);
  }

  return (
    <Card styles={{ paddingTop: '0', paddingBottom: '0.75rem' }}>
      <ScrollElement name={`stack-${stackId}`}>
        <div className="stack">
          <div className="stack-main">
            {displayOrder && typeof stack.order === 'number' ? (
              <span className="order">{stack.order + 1}</span>
            ) : null}
            <div className="title">
              {items}
              <h2>{stack.title}</h2>
            </div>
          </div>

          <div className="content-area">
            <p>{stack.description}</p>
          </div>

          <div>
            {stack.stackEventId ? (
              <EventCard eventId={stack.stackEventId} className="event-card" />
            ) : null}
          </div>

          <Share type="stack" stack={stack} />

          {newsIdList && newsIdList.length > 0 ? <NewsItemList newsIdList={newsIdList} /> : null}
        </div>
      </ScrollElement>

      <style jsx>
        {`
          .title {
            padding-top: 0.8rem;
          }

          .title :global(.separator) {
            margin: 0 0.35rem;
          }

          h2 {
            line-height: 1.5;
            display: block;
          }

          .order {
            font-family: 'Lexend Giga', sans-serif;
            margin-top: 0.75rem;
            font-size: 3.5rem;
            line-height: 3.35rem;
            color: rgb(30, 139, 195);
            float: left;
            margin-right: 0.5rem;
          }

          .content-area {
            margin-top: 0.5rem;
          }

          .content-area p {
            line-height: 1.8;
            display: block;
          }

          .stack :global(.event-card) {
            border: 1px solid #ccc;
            box-shadow: none;
          }

          .stack :global(.event-card):hover {
            box-shadow: 0 2.5px 7.5px rgba(0, 0, 0, 0.0375);
          }
        `}
      </style>
    </Card>
  );
};

export const Stack = StackImpl;
