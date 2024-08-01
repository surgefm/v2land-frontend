import React from 'react';
import { ICard } from './Card';

export const Card: React.FunctionComponent<ICard.IProps> = React.forwardRef(
  ({ className, styles, children }, ref) => {
    return (
      <div
        className={`card background-color ${className || ''}`}
        style={styles}
        ref={ref as React.RefObject<HTMLDivElement>}
      >
        {children}
        <style jsx>
          {`
            .card {
              max-width: 45rem;
              width: 100%;
              display: block;
              padding: 1.5rem 2rem;
              margin-bottom: 1.25rem;
              border-radius: 0.5rem;
              z-index: 1000;
              box-shadow: none;
              transition: all 0.2s;
              background-color: #fff;
              box-shadow: 0 2.5px 7.5px rgba(0, 0, 0, 0.0375);
              -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
            }

            .card:hover {
              box-shadow: 0 7.5px 32px rgba(0, 0, 0, 0.075), 0 2.5px 7.5px rgba(0, 0, 0, 0.0375);
            }

            :global(.generating-screenshot) .card {
              padding: 0.75rem 1rem;
              box-shadow: 0 5px 5px rgba(0, 0, 0, 0.025) !important;
            }

            @media (max-width: 600px) {
              .card {
                padding: 0.75rem 1rem;
                box-shadow: 0 5px 5px rgba(0, 0, 0, 0.025) !important;
              }
            }
          `}
        </style>
      </div>
    );
  }
);
