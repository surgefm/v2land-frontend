import { WithTranslation } from 'next-i18next';

declare namespace INewsroomPanelCreateStackButton {
  export interface IProps extends WithTranslation {
    eventId: number;
  }
}

export { INewsroomPanelCreateStackButton };
