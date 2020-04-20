import React from 'react';
import { INewsroomPanelTitle } from './Title';

const NewsroomPanelTitle: React.FunctionComponent<INewsroomPanelTitle.IProps> = ({ children }) => (
  <p>
    {children}
    <style jsx>
      {`
        p {
          margin: 0 0.5rem;
          font-weight: 500;
          line-height: 1.25;
        }
      `}
    </style>
  </p>
);

export { NewsroomPanelTitle };
