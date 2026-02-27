import React from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { Button } from 'antd';
import { DiffOutlined } from '@ant-design/icons';

import { getActiveNewsroomId, canCurrentClientEditEvent } from '@Selectors';

const NewsroomHeaderReviewButtonImpl: React.FC = () => {
  const router = useRouter();
  const eventId = useSelector(getActiveNewsroomId);
  const canEdit = useSelector(canCurrentClientEditEvent());

  const navigateToReview = () => {
    const { username, eventName } = router.query;
    router.push(`/${username}/${eventName}/review`);
  };

  if (!eventId) return null;

  return (
    <div className="button">
      <Button
        size="large"
        shape="round"
        icon={<DiffOutlined />}
        disabled={!canEdit}
        onClick={navigateToReview}
      >
        Review
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

export const NewsroomHeaderReviewButton = NewsroomHeaderReviewButtonImpl;
