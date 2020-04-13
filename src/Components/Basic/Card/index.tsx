import React from 'react';
import { ICard } from './Card';
import './style.scss';

export const Card: React.FunctionComponent<ICard.IProps> = ({ className, children }) => {
  return <div className={`card background-color ${className}`}>{children}</div>;
};
