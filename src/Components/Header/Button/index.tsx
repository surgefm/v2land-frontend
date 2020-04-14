import React from 'react';
import Link from 'next/link';
import { IHeaderButton } from './Button';

export const HeaderButton: React.FunctionComponent<IHeaderButton.IProps> = ({
  text,
  children,
  href,
}): JSX.Element => {
  const content = (
    <span className="button">
      {children || text}
      <style jsx>
        {`
          .button {
            color: #333;
            padding: 0.5rem 0.75rem;
            cursor: pointer;
            min-width: 5.5rem;
            margin: 1rem 0.25rem;
            text-align: center;
            user-select: none;
            border-radius: 0.5rem;
          }

          .button:hover {
            background-color: rgba(0, 0, 0, 0.1);
          }
        `}
      </style>
    </span>
  );

  if (!href) return content;
  if (href[0] === '/') return <Link href={href}>{content}</Link>;
  return <a href={href}>{content}</a>;
};
