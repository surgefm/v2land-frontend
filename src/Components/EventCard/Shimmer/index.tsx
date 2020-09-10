import React from 'react';

import styles from '@Static/css/shimmer.scss';

export const EventCardShimmer: React.FunctionComponent = () => (
  <div className="event-container">
    <div className="event-image-container img-background">
      <div className={`event-image event-image-shimmer ${styles.shimmer}`} />
    </div>
    <div className="description event-description light-font limit">
      <div className={`${styles['title-shimmer']} ${styles.shimmer}`} />
      <div className={`${styles['line-shimmer']} ${styles.shimmer}`} />
      <div className={`${styles['line-shimmer']} ${styles.shimmer}`} />
      <div className={`${styles['line-shimmer']} ${styles.shimmer}`} />
    </div>
    <style jsx>
      {`
        .event-container {
          width: 100%;
          padding: 1.5rem;
          position: relative;
          overflow: hidden;
          padding-right: 13.5rem;
          border-bottom-right-radius: 0.5rem;
          border-top-right-radius: 0.5rem;
        }

        .event-description {
          margin-top: 0.5rem;
        }

        .event-description.limit {
          max-height: 7.2rem;
        }

        .event-image-container {
          width: 12rem;
          height: 100%;
          margin: 0;
          background-size: cover;
          background-position: center;
          position: absolute;
          right: 0;
          top: 0;
        }

        .event-image {
          object-fit: cover;
          border-top-right-radius: 0.5rem;
          border-bottom-right-radius: 0.5rem;
          width: 100%;
          height: 100%;
        }

        @media (max-width: 600px) {
          .event-text {
            padding-right: 1.5rem;
          }

          .event-description.limit {
            max-height: 9rem;
          }

          .event-image-container {
            display: none;
          }
        }
      `}
    </style>
  </div>
);
