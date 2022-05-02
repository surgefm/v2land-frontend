import React from 'react';

import { ClientAvatar } from '@Components/Client';
import { IContributorCard } from './ContributorCard';

const ContributorCard: React.FunctionComponent<IContributorCard.IProps> = ({ contributor }) => {
  return (
    <div>
      <ClientAvatar clientId={144} asLink showTooltip={false} />
      <span>{contributor}</span>
      <style jsx>
        {`
          div {
            display: flex;
            align-items: center;
            padding: 0.25rem 0;
            cursor: pointer;
          }

          div:first-child,
          div.first-child {
            border-top-right-radius: 0.25rem;
            border-top-left-radius: 0.25rem;
            padding-top: 0.5rem;
          }

          div:last-child {
            border-bottom-right-radius: 0.25rem;
            border-bottom-left-radius: 0.25rem;
            padding-bottom: 0.5rem;
          }

          span {
            font-size: 1.25rem;
            margin-left: 0.75rem;
            transition: all 0.2s;
          }

          div:hover * {
            color: rgb(30, 139, 195);
          }
        `}
      </style>
    </div>
  );
};

export { ContributorCard };
