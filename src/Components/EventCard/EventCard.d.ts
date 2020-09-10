declare namespace IEventCard {
  export interface IProps {
    eventId: number;
    forcePlain?: boolean;
    styles?: React.StyleHTMLAttributes;
    className?: string;
  }
}

export { IEventCard };
