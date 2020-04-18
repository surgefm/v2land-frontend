import React from 'react';
import LazyLoad from 'react-lazyload';

import { EventCardTitle } from '../Title';
import { EventCardDescription } from '../Description';
import { IImageEventCard } from './ImageEventCard';

export const ImageEventCard: React.FunctionComponent<IImageEventCard.IProps> = ({ event }) => {
  if (!event.headerImage) return <div />;

  const sourceUrl = event.headerImage.sourceUrl
    ? `/redirect.html?to=${encodeURIComponent(event.headerImage.sourceUrl)}`
    : undefined;
  const openImageSourceUrl = (e: React.MouseEvent) => {
    e.preventDefault();
    if (sourceUrl) {
      window.open(sourceUrl, '_blank');
    }
  };

  const showImage = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.style.opacity = '1';
  };

  return (
    <div className="event-container">
      <div className="event-image-container">
        <LazyLoad once>
          <img
            alt={event.headerImage.source}
            src={`https://assets.v2land.net/240x240/${event.headerImage.imageUrl}`}
            className="event-image"
            onLoad={showImage}
          />
        </LazyLoad>
        <button onClick={openImageSourceUrl} type="button">
          {event.headerImage.source}
        </button>
      </div>
      <EventCardTitle className="title">{event.name}</EventCardTitle>
      <EventCardDescription className="description">{event.description}</EventCardDescription>
      <style jsx>
        {`
          .event-container {
            display: flex;
            flex-direction: column;
            width: 100%;
            padding: 1.5rem;
            position: relative;
            overflow: hidden;
            padding-right: 13.5rem;
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
            background-color: rgba(0, 131, 168, 0.035);
          }

          .event-image {
            object-fit: cover;
            border-top-right-radius: 0.5rem;
            border-bottom-right-radius: 0.5rem;
            width: 100%;
            height: 100%;
            transition: all 0.2s;
            opacity: 0;
          }

          .event-image-container button {
            position: absolute;
            right: 0.25rem;
            bottom: 0.25rem;
            font-size: 0.75rem;
            padding: 0.35rem;
            background-color: #333;
            color: #fff;
            line-height: 1;
            border-radius: 0.25rem;
            user-select: none;
            border: none;
            cursor: pointer;
            transition: all 0.2s;
          }

          .event-image-container button:hover {
            background-color: #444;
          }

          @media (max-width: 600px) {
            .event-container {
              padding: 0;
              display: block;
            }

            .event-container > :global(.title) {
              margin: 1rem 0.5rem 0 1rem;
            }

            .event-container > :global(.description) {
              margin: 0.5rem 1rem 1rem 1rem;
            }

            .event-image-container {
              width: 102px;
              height: 102px;
              margin-left: 1rem;
              position: relative;
              float: right;
              border-radius: 0.25rem;
              top: 0.5rem;
              right: 0.5rem;
            }

            .event-image-container button {
              border-top-right-radius: 0;
              border-bottom-left-radius: 0;
              right: 0;
              bottom: 0;
              padding: 0.25rem;
            }

            .event-image {
              height: 100%;
              border-radius: 0.25rem;
            }
          }
        `}
      </style>
    </div>
  );
};
