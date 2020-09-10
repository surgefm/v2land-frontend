import { WithTranslation } from 'next-i18next';

declare namespace INewsroomPanelSortStacksButton {
  export interface IProps extends WithTranslation {
    eventId: number;
    offshelf?: boolean;
  }
}

export { INewsroomPanelSortStacksButton };
