import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Skeleton } from 'antd';

import { ThunkDispatch } from '@Interfaces';
import { ClientActions, EventActions } from '@Actions';
import { getEvent, getEventOwner } from '@Selectors';

import { IStackFormEventItem } from './EventItem';

export const StackFormEventItem: React.FunctionComponent<IStackFormEventItem.IProps> = ({
  eventId,
}) => {
  const dispatch = useDispatch() as ThunkDispatch;
  const event = useSelector(getEvent(eventId));
  const owner = useSelector(getEventOwner(eventId));

  if (!event) {
    dispatch(EventActions.GetEvent(eventId));
    return <Skeleton.Input style={{ width: '120px' }} size="small" active />;
  }

  if (!owner && event.ownerId) {
    dispatch(ClientActions.GetClient(event.ownerId));
  }

  return (
    <span>
      {owner ? (
        `@${owner.username}`
      ) : (
        <Skeleton.Input
          style={{ width: '80px', height: '1rem', marginRight: '0.25rem' }}
          size="small"
          active
        />
      )}
      /{event.name}
      <style jsx>
        {`
          span {
            display: flex;
            align-items: center;
          }

          span > :global(.ant-skeleton) {
            width: initial;
            height: 1rem;
          }
        `}
      </style>
    </span>
  );
};
