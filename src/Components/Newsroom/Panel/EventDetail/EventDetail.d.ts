import { WithTranslation } from 'next-i18next';

declare namespace INewsroomPanelEventDetail {
  export interface IProps extends WithTranslation {
    eventId: number;
  }
}

export { INewsroomPanelEventDetail };
