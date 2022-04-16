import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { IHeaderButton } from './Button';

export const HeaderButton: React.FunctionComponent<IHeaderButton.IProps> = ({
  text,
  Icon,
  children,
  onClick,
  href,
  as,
}): JSX.Element => {
  const router = useRouter();
  const isLink = as || href;
  const isActiveRoute = router.asPath === (as || href);

  const buttonProps = isLink ? { href: as || href } : { onClick };

  const content = (
    <a className="button-container" {...buttonProps}>
      <div className={`button ${!isActiveRoute || 'active'}`}>
        {Icon && <Icon style={{ fontSize: 20, position: 'relative', top: 2, marginRight: 8 }} />}
        {children || text}
      </div>
      {isLink && <div className={`bottom-line ${!isActiveRoute || 'active'}`} />}
      <style jsx>
        {`
          .button-container {
            height: 3.5rem;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            overflow: hidden;
            line-height: 2;
            font-size: 1rem;
          }

          .button {
            color: #333;
            padding: 0.35rem 1.5rem;
            cursor: pointer;
            white-space: nowrap;
            margin: 1rem 0.25rem;
            text-align: center;
            user-select: none;
            border-radius: 0.5rem;
            transition: all 0.2s;
            align-items: center;
          }

          .button.active {
            color: rgb(30, 139, 195);
          }

          .button.small {
          }

          .button:hover:not(.small) {
            background-color: rgba(0, 0, 0, 0.075);
          }

          .button:active {
            transform: scale(0.9);
          }

          .bottom-line {
            position: absolute;
            bottom: 0;
            height: 0;
            width: 80%;
            transition: all 0.1s;
            height: 0.25rem;
            transform: translateY(0.25rem);
            background-color: rgba(30, 139, 195, 0.8);
          }

          .bottom-line.active {
            transform: translateY(0);
          }

          @media (max-width: 600px) {
            .button-container {
              height: 3rem;
            }

            .button {
              padding: 0.1rem 0.5rem;
              margin: 0.35rem 0.1rem;
            }
          }
        `}
      </style>
    </a>
  );

  if (!href) return content;
  if (href[0] === '/')
    return (
      <Link href={href} as={as}>
        {content}
      </Link>
    );
  return content;
};
