import React from 'react';
import { ILogo } from './Logo';

export const Logo: React.FunctionComponent<ILogo.IProps> = ({ height, className }) => {
  return (
    <img
      style={{
        height: `${height}px`,
      }}
      alt="logo"
      className={className}
      src="/images/icon.svg"
    />
  );
};
