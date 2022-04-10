import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { Button } from 'antd';
import { ExportOutlined } from '@ant-design/icons';

import { useTranslation } from '@I18n';
import { UtilService } from '@Services';
import { getEventId, getEvent, getEventOwner, canCurrentClientViewEvent } from '@Selectors';

import { INewsroomHeaderEnterButton } from './EnterButton';

const NewsroomHeaderEnterButtonImpl: React.FC<INewsroomHeaderEnterButton.IProps> = ({
  eventId: id,
}) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const routeEventId = useSelector(
    getEventId(router.query.username as string, router.query.eventName as string)
  );
  const eventId = id || routeEventId;
  const event = useSelector(getEvent(eventId));
  const owner = useSelector(getEventOwner(eventId));
  const canView = useSelector(canCurrentClientViewEvent(eventId));
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    setClicked(false);
  }, [router]);

  if (!canView || !event) return <React.Fragment />;
  if (router.route !== '/[username]/[eventName]') return <React.Fragment />;

  const handleButtonClick = async () => {
    UtilService.redirect(`${UtilService.getEventPath(event, owner)}/newsroom`);
    setClicked(true);
  };

  return (
    <div className="button">
      <Button
        type="primary"
        size="large"
        shape="round"
        loading={clicked}
        icon={<ExportOutlined />}
        onClick={handleButtonClick}
      >
        {t('Newsroom_EnterButton_Label')}
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

export const NewsroomHeaderEnterButton = NewsroomHeaderEnterButtonImpl;
