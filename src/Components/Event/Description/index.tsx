import React from 'react';
import { IEventDescription } from './Description';

export const EventDescription: React.FunctionComponent<IEventDescription.IProps> = ({
  description,
}) => (
  <div className="description">
    <span>{description}</span>
    <style jsx>
      {`
        .description {
          color: #333;
          padding: 0;
          margin-top: 1rem;
          position: relative;
          white-space: pre-line;
        }

        span {
          line-height: 1.8 !important;
          display: block;
        }
      `}
    </style>
  </div>
);
