import { WithTranslation } from 'next-i18next';

declare namespace INewsroomPanelAddClientButton {
  export interface IProps extends WithTranslation {
    eventId: number;
  }
}

export { INewsroomPanelAddClientButton };
