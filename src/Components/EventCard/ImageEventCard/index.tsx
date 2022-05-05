import React from 'react';

import { Image } from '@Components/Basic';
import { ClientAvatar } from '@Components/Client';
import { EventCardTitle } from '../Title';
import { EventCardDescription } from '../Description';
import { EventInfoList } from '../InfoList';
import { IImageEventCard } from './ImageEventCard';

export const ImageEventCard: React.FunctionComponent<IImageEventCard.IProps> = ({ event }) => {
  if (!event.headerImage) return <div />;

  const sourceUrl = event.headerImage.sourceUrl
    ? `/redirect.html?to=${encodeURIComponent(event.headerImage.sourceUrl)}`
    : undefined;
  const openImageSourceUrl = (e: React.MouseEvent) => {
    if (sourceUrl) {
      e.preventDefault();
      window.open(sourceUrl, '_blank');
    }
  };

  return (
    <div className="event-container">
      <div className="event-image-container">
        <Image
          alt={event.headerImage.source || 'image source'}
          src={`https://cdn.surge.fm/${event.headerImage.imageUrl}`}
          className="event-image"
          layout="fill"
        />
        <button onClick={openImageSourceUrl} type="button">
          {event.headerImage.source}
        </button>
      </div>
      {event.ownerId ? (
        <div className="avatar">
          <ClientAvatar clientId={event.ownerId} asLink />
        </div>
      ) : null}
      <EventCardTitle className="title">{event.name}</EventCardTitle>
      <EventCardDescription className="description">{event.description}</EventCardDescription>
      <EventInfoList
        className="info-list"
        starCount={event.starCount || 0}
        tagIdList={event.tagIdList}
      />

      <style jsx>
        {`
          .event-container {
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
            box-shadow: 0 0 2px rgb(0 0 0 / 10%);
          }

          .event-container :global(.event-image) {
            object-fit: cover;
            border-top-right-radius: 0.5rem;
            border-bottom-right-radius: 0.5rem;
            width: 100%;
            height: 100%;
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

          .avatar {
            float: right;
            margin-left: 0.25rem;
          }

          @media (max-width: 600px) {
            .event-container {
              padding: 0;
              display: block;
            }

            .event-container > :global(.title) {
              margin: 1rem 0.5rem 0 1rem;
            }

            .avatar {
              margin-top: 1rem;
            }

            .event-container > :global(.description) {
              margin: 0.5rem 1rem 1rem 1rem;
            }

            .event-container > :global(.info-list) {
              margin: 0.5rem 1rem 1rem 1rem;
            }

            .event-image-container {
              width: 6rem;
              height: 6rem;
              overflow: hidden;
              margin-left: 1rem;
              position: relative;
              float: right;
              border-radius: 0.25rem;
              top: 0.5rem;
              right: 0.5rem;
              z-index: 3;
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
