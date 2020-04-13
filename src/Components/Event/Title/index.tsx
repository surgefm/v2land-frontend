import React from 'react';
import { ITitle } from './Title';
import './style.scss';

export const EventTitle: React.FunctionComponent<ITitle.IProps> = ({ className, children }) => {
  return <div className={`title ${className}`}>{children}</div>;
};
