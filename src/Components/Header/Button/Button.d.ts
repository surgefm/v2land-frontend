import { MouseEventHandler } from 'react';
import Icon from '@ant-design/icons';

declare namespace IHeaderButton {
  export interface IProps {
    text?: string;
    Icon?: Icon;
    children?: JSX.Element | JSX.Element[] | string;
    href?: string;
    as?: string;
    onClick?: MouseEventHandler<HTMLAnchorElement> | undefined;
  }
}

export { IHeaderButton };
