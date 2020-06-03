import React from 'react';
import { useSelector } from 'react-redux';

import { getStack, getStackNewsIdList, getStackTime, getEvent, getEventOwner } from '@Selectors';
import { UtilService } from '@Services';
import { Card, Time } from '@Components/Basic';
import { Share } from '@Components/Share';

import { IStack } from './Stack';
import { NewsItemList } from './NewsItemList';
import { StackShimmer } from './Shimmer';

export * from './Form';
export * from './Shimmer';

const Stack: React.FunctionComponent<IStack.IProps> = ({
  stackId,
  isLatestStack = false,
  displayOrder = true,
  showEventName = false,
}) => {
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
    items.push(<span key="3">最新进展</span>);
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
    <Card styles={{ paddingTop: '0', paddingBottom: '0' }}>
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

        <Share type="stack" stack={stack} />

        <NewsItemList newsIdList={newsIdList} />

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
              margin-top: 0.8rem;
              font-family: 'Lexend Giga', sans-serif;
              font-size: 3.2rem;
              color: rgb(30, 139, 195);
              float: left;
              margin-right: 0.5rem;
              line-height: 1;
            }

            .content-area {
              margin-top: 0.5rem;
            }

            .content-area p {
              line-height: 1.8;
              display: block;
            }
          `}
        </style>
      </div>
    </Card>
  );
};

export { Stack };
