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
  const openImageSourceUrl = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
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
        <a onClick={openImageSourceUrl} href={sourceUrl}>
          {event.headerImage.source}
        </a>
      </div>
      <EventCardTitle>{event.name}</EventCardTitle>
      <EventCardDescription>{event.description}</EventCardDescription>
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

          .event-image-container a {
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
          }
        `}
      </style>
    </div>
  );
};
