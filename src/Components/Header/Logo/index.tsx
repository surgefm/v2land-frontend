import React from 'react';
import Link from 'next/link';

import { Logo } from '@Components/Basic/Logo';

export const HeaderLogo: React.FunctionComponent = () => {
  return (
    <Link href="/" className="link">
      <>
        <Logo styles={{ width: '1.85rem', height: '1.85rem' }} />
        <style jsx>
          {`
            a {
              display: none;
            }

            a:hover {
              background-color: rgba(0, 0, 0, 0.075);
            }

            a:active {
              transform: scale(0.9);
            }

            .link > :global(span) {
              width: 2.75rem !important;
              display: block;
            }

            @media (max-width: 700px) {
              a {
                display: none;
              }
            }
          `}
        </style>
      </>
    </Link>
  );
};
