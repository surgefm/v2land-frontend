import React from 'react';
import { IEventDescription } from './Description';
import './style.scss';

export const EventDescription: React.FunctionComponent<IEventDescription.IProps> = ({
  description,
}) => (
  <div className="description">
    <span>{description}</span>
  </div>
);
