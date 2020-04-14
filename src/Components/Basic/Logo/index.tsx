import React from 'react';
import { ILogo } from './Logo';

export const Logo: React.FunctionComponent<ILogo.IProps> = ({ className, height, styles }) => {
  return (
    <img
      style={{
        maxHeight: '100%',
        ...(height ? { height: `${height}px` } : {}),
        ...styles,
      }}
      alt="logo"
      className={className}
      src="/images/icon.svg"
    />
  );
};
