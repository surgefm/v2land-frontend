import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Space, Tooltip, Spin, message } from 'antd';
import { StarTwoTone, StarFilled } from '@ant-design/icons';

import {
  getEventStarCount,
  hasLoggedInClientStarredEvent,
  isLoggedIn as isLoggedInSelector,
} from '@Selectors';
import { post, del } from '@Services/API/Http';
import { RedstoneService } from '@Services';
import { ClientItem } from '@Components/Client';
import { Star } from '@Interfaces';
import { ClientActions, EventActions } from '@Actions';
import { IEventStar } from './Star';

export const EventStar: React.FunctionComponent<IEventStar.IProps> = ({ eventId }) => {
  const isLoggedIn = useSelector(isLoggedInSelector);
  const starCount = useSelector(getEventStarCount(eventId));
  const hasStarred = useSelector(hasLoggedInClientStarredEvent(eventId));
  const dispatch = useDispatch();

  const iconStyle = { fontSize: '1.5rem', color: '#f7ca18' };

  const star = async () => {
    if (!isLoggedIn) {
      message.info('请先登录');
      return;
    }
    if (hasStarred) await del(`/event/${eventId}/star`);
    else await post(`/event/${eventId}/star`);
    const { client } = await RedstoneService.getClientInfo();
    dispatch(ClientActions.AddClient(client));
    dispatch(EventActions.GetEvent(eventId));
    if (hasStarred) message.success('成功取消收藏');
    else message.success('收藏成功');
  };

  const Stargazers = () => {
    const [stars, setStars] = useState<Star[]>([]);

    useEffect(() => {
      if (stars.length > 0) return;
      RedstoneService.getAllStars(eventId).then(starList => {
        setStars(starList);
      });
    });

    if (stars.length === 0) return <Spin />;

    return (
      <div className="user-list">
        {stars.map(s => (
          <div key={s.clientId}>
            <ClientItem clientId={s.clientId} />
          </div>
        ))}
        <style jsx>
          {`
            .user-list {
              display: flex;
              flex-direction: column;
              max-height: 50vh;
              width: 14rem;
            }
          `}
        </style>
      </div>
    );
  };

  return (
    <div className="container">
      <Space size={0}>
        {starCount > 0 && (
          <Tooltip
            color="white"
            title={<Stargazers />}
            placement="bottomRight"
            align={{ offset: [18, 0] }}
          >
            <span
              style={{
                width: `${`${starCount}`.length * 11}px`,
                cursor: 'pointer',
              }}
            >
              {starCount}
            </span>
          </Tooltip>
        )}
        <Button
          size="large"
          type="link"
          onClick={star}
          icon={
            hasStarred || !isLoggedIn ? (
              <StarFilled style={iconStyle} />
            ) : (
              <StarTwoTone style={iconStyle} twoToneColor="#f7ca18" />
            )
          }
        />
      </Space>

      <style jsx>
        {`
          .container {
            padding-top: 0.25rem;
            padding-left: 0.25rem;
            transform: translateX(0.5rem);
            float: right;
            display: inline-flex;
            flex-direction: column;
            align-items: center;
          }

          .container span {
            font-size: 1rem;
            font-family: 'Lexend Giga', sans-serif;
            color: rgba(0, 0, 0, 0.45);
          }

          @media (max-width: 600px) {
            .container {
              padding-top: 0;
              transform: translateX(0.5rem) translateY(-0.1rem);
            }
          }
        `}
      </style>
    </div>
  );
};
