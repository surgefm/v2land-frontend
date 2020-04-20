import React from 'react';
import { INewsroomPanelCard } from './Card';

const NewsroomPanelCard: React.FunctionComponent<INewsroomPanelCard.IProps> = ({
  children,
  className,
}) => (
  <div className={className}>
    {children}
    <style jsx>
      {`
        div {
          border-radius: 0.25rem;
          box-shadow: 0 2.5px 7.5px rgba(0, 0, 0, 0.0375), 0 1.5px #e3e3e3;
          padding: 0.25rem 0.5rem;
          background-color: rgb(232, 232, 232);
          margin: 0.375rem 0;
        }
      `}
    </style>
  </div>
);

export { NewsroomPanelCard };
