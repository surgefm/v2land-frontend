import React from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { Button } from 'antd';
import { FormOutlined } from '@ant-design/icons';

import { useTranslation } from '@I18n';
import {
  canCurrentClientEditEvent,
} from '@Selectors';

import { INewsroomHeaderCommitButton } from './CommitButton';

const NewsroomHeaderCommitButtonImpl: React.FC<INewsroomHeaderCommitButton.IProps> = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const canEdit = useSelector(canCurrentClientEditEvent());

  const goToReview = () => {
    const { username, eventName } = router.query;
    router.push(`/${username}/${eventName}/review`);
  };

  return (
    <div className="button">
      <Button
        type="primary"
        size="large"
        shape="round"
        icon={<FormOutlined />}
        disabled={!canEdit}
        onClick={goToReview}
        className="fab-btn"
      >
        {t('Newsroom_CommitButton_Label')}
      </Button>
      <style jsx>
        {`
          .button {
            transition: all 0.5s;
            margin-left: 0.5rem;
            width: min-content;
          }

          .button:active {
            transform: scale(0.9);
          }
        `}
      </style>
    </div>
  );
};

export const NewsroomHeaderCommitButton = NewsroomHeaderCommitButtonImpl;
