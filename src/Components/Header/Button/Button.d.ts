import { MouseEventHandler } from 'react';

declare namespace IHeaderButton {
  export interface IProps {
    text?: string;
    children?: JSX.Element | JSX.Element[] | string;
    href?: string;
    as?: string;
    onClick?: MouseEventHandler<HTMLAnchorElement> | undefined;
  }
}

export { IHeaderButton };
