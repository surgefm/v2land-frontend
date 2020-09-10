import { WithTranslation } from 'next-i18next';

declare namespace INewsroomHeaderEnterButton {
  export interface IProps extends WithTranslation {
    eventId?: number;
  }
}

export { INewsroomHeaderEnterButton };
