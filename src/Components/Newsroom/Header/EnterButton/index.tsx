import React from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { Button } from 'antd';
import { ExportOutlined } from '@ant-design/icons';

import { UtilService } from '@Services';
import { getEventId, getEvent, getEventOwner, canCurrentClientViewEvent } from '@Selectors';

import { INewsroomHeaderEnterButton } from './EnterButton';

export const NewsroomHeaderEnterButton: React.FunctionComponent<
  INewsroomHeaderEnterButton.IProps
> = ({ eventId: id }) => {
  const router = useRouter();
  const routeEventId = useSelector(
    getEventId(router.query.username as string, router.query.eventName as string)
  );
  const eventId = id || routeEventId;
  const event = useSelector(getEvent(eventId));
  const owner = useSelector(getEventOwner(eventId));
  const canView = useSelector(canCurrentClientViewEvent(eventId));

  if (!canView || !event) return <React.Fragment />;
  if (router.route !== '/[username]/[eventName]') return <React.Fragment />;

  const ownerId = owner ? owner.username : event.ownerId;

  const handleButtonClick = async () => {
    UtilService.redirect(`/@${ownerId}/${Math.abs(event.id)}-${event.pinyin}}/newsroom`);
  };

  return (
    <div className="button">
      <Button
        type="primary"
        size="large"
        shape="round"
        icon={<ExportOutlined />}
        onClick={handleButtonClick}
      >
        进入新闻编辑室
      </Button>
      <style jsx>
        {`
          .button {
            transition: all 0.5s;
            margin-left: 0.5rem;
          }

          .button:active {
            transform: scale(0.9);
          }
        `}
      </style>
    </div>
  );
};
