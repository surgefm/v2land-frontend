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
          padding: 0.2rem 0.4rem;
          background-color: rgb(232, 232, 232);
          border: 1px solid transparent;
          transition: all 0.2s;
          line-height: 2;
        }

        div:hover {
          border: 1px solid #555;
        }
      `}
    </style>
  </div>
);

export { NewsroomPanelCard };
