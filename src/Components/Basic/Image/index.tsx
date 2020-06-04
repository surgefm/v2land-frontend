import React from 'react';
import LazyLoad from 'react-lazyload';

import { IImage } from './Image';

export const Image: React.FunctionComponent<IImage.IProps> = props => {
  const { src, style, alt } = props;

  let cached = false;
  try {
    cached = !!window.performance.getEntriesByName(src)[0].duration;
    cached = true;
  } catch (err) {
    // Do nothing
  }

  if (cached) {
    return (
      <LazyLoad once>
        <img {...props} alt={alt} />
      </LazyLoad>
    );
  }

  return (
    <LazyLoad once>
      <img
        {...props}
        alt={alt}
        style={{ ...style, opacity: 0, transition: 'all 0.2s' }}
        onLoad={e => {
          e.currentTarget.style.opacity = '1';
        }}
      />
    </LazyLoad>
  );
};
