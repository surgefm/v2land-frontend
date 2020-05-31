declare namespace IClientAvatar {
  export interface IProps {
    clientId: number;
    eventId?: number; // to show event role
    role?: string;
    showTooltip?: boolean;
    asLink?: boolean;
  }
}

export { IClientAvatar };
