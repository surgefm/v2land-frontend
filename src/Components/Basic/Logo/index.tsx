import React from 'react';
import { Image } from '@Components/Basic';
import { ILogo } from './Logo';

export const Logo: React.FunctionComponent<ILogo.IProps> = ({ className, height, styles }) => {
  return (
    <Image
      style={{
        maxHeight: '100%',
        ...(height
          ? {
              height: `${height}px`,
              width: `${(30.38 * 32) / height}px`,
            }
          : {}),
        ...styles,
      }}
      alt="logo"
      className={className}
      src="/images/icon.svg"
    />
  );
};
