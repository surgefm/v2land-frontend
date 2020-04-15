import React from 'react';
import { IEventCardDescription } from './Description';

export const EventCardDescription: React.FunctionComponent<IEventCardDescription.IProps> = ({
  children,
  styles,
  className,
}) => (
  <div className={`description light-font ${className || ''}`} style={styles}>
    <span>{children}</span>
    <div className="fade" />
    <div className="hide" />
    <style jsx>
      {`
        .description {
          color: #333;
          padding: 0;
          margin-top: 1rem;
          position: relative;
          margin-top: 0.5rem;
          max-height: 7.2rem;
        }

        span {
          line-height: 1.8 !important;
          display: block;
        }

        .fade {
          content: '';
          text-align: right;
          position: absolute;
          bottom: 0;
          right: 0;
          width: 5rem;
          height: 1.8rem;
          background: linear-gradient(to right, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1) 90%);
        }

        .hide {
          background-color: white;
          width: 100%;
          position: absolute;
          height: 100%;
          top: 100%;
        }

        @media (max-width: 600px) {
          .description {
            max-height: 9rem;
          }
        }
      `}
    </style>
  </div>
);
