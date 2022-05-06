import { AvatarProps } from 'antd/es/avatar';

declare namespace IClientAvatar {
  export interface IProps extends AvatarProps {
    clientId: number;
    eventId?: number; // to show event role
    role?: string;
    showTooltip?: boolean;
    asLink?: boolean;
    avatar?: string;
    size?: number;
    showRole?: boolean;
    asA?: boolean;
  }
}

export { IClientAvatar };
