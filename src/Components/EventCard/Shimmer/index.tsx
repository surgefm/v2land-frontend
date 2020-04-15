import React from 'react';

export const EventCardShimmer: React.FunctionComponent = () => (
  <div className="event-container">
    <div className="event-image-container img-background">
      <div className="event-image event-image-shimmer shimmer" />
    </div>
    <div className="description event-description light-font limit">
      <div className="title-shimmer shimmer" />
      <div className="line-shimmer shimmer" />
      <div className="line-shimmer shimmer" />
      <div className="line-shimmer shimmer" />
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

        .title-shimmer {
          height: 1.5rem;
          width: 10rem;
        }

        .event-image-shimmer {
          width: 240px;
          height: 240px;
        }

        .line-shimmer {
          height: 1rem;
          margin-top: 0.8rem;
          margin-bottom: 0.8rem;
          width: 100%;
        }

        .shimmer {
          animation-duration: 0.8s;
          animation-fill-mode: forwards;
          animation-iteration-count: infinite;
          animation-name: shimmer-ani;
          animation-timing-function: linear;
          background: linear-gradient(
            90deg,
            rgb(241, 241, 241) 0,
            rgb(247, 249, 250) 10%,
            rgb(210, 210, 210) 40%,
            rgb(223, 223, 223) 73%,
            #f7f9fa 100%
          );
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

        @keyframes shimmer-ani {
          0%,
          100% {
            opacity: 0.2;
          }
          50% {
            opacity: 0.45;
          }
        }
      `}
    </style>
  </div>
);
