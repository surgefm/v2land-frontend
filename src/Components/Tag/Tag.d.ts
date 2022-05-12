import { Tag } from '@Interfaces';

declare namespace ITag {
  export interface IProps {
    tagId?: number;
    tag?: Tag;
    removable?: boolean;
    eventId?: number;
    asLink?: boolean;
    style?: React.StyleHTMLAttributes;
  }
}

export { ITag };
