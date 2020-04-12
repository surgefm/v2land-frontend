import React from 'react';
import { ILogo } from './Logo';

export const Logo: React.FunctionComponent<ILogo.IProps> = props => {
  return <img alt="logo" src="/images/icon.svg" {...props} />;
};
