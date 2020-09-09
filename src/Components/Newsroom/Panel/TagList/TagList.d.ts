import { WithTranslation } from 'next-i18next';

declare namespace INewsroomPanelTagList {
  export interface IProps extends WithTranslation {
    eventId: number;
  }
}

export { INewsroomPanelTagList };
