import React from 'react';
import { ILogo } from './Logo';

export const Logo: React.FunctionComponent<ILogo.IProps> = ({ className, height = 32, styles }) => {
  return (
    <img
      style={{
        maxHeight: '100%',
        ...styles,
      }}
      alt="logo"
      className={className}
      height={height}
      width={(30.38 * 32) / height}
      src="/images/icon.svg"
    />
  );
};
