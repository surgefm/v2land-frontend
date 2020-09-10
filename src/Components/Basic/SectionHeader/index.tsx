import React from 'react';

import { ISectionHeader } from './SectionHeader';

export const SectionHeader: React.FunctionComponent<ISectionHeader.IProps> = ({
  children,
  styles,
  className,
}) => (
  <span className={className || ''} style={styles || {}}>
    {children}
    <style jsx>
      {`
        span {
          font-size: 1.5rem;
          font-weight: bold;
          display: block;
          margin-bottom: 0.5rem;
        }

        span:not(:first-child) {
          margin-top: 1rem;
        }
      `}
    </style>
  </span>
);
