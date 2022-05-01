import React from 'react';

import { useTranslation } from '@I18n';
import { ClientAvatar } from '@Components/Client';

import { INewsroomPanelLockMask } from './LockMask';

const NewsroomPanelLockMaskImpl: React.FunctionComponent<INewsroomPanelLockMask.IProps> = ({
  locker,
  text,
  dark,
}) => {
  const { t } = useTranslation('common');
  return (
    <div>
      <ClientAvatar clientId={locker} showRole />
      <span>{t('Newsroom_Lock') || text}</span>
      <style jsx>
        {`
          div {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: ${dark ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.85)'};
            border-radius: 0.25rem;
            z-index: 900;
          }

          span {
            color: ${dark ? '#fff' : '#000'};
            margin-left: 0.5rem;
            user-select: none;
          }
        `}
      </style>
    </div>
  );
};

export const NewsroomPanelLockMask = NewsroomPanelLockMaskImpl;
