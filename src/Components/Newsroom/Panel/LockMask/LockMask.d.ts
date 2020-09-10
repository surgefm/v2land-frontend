import { WithTranslation } from 'next-i18next';

declare namespace INewsroomPanelLockMask {
  export interface IProps extends WithTranslation {
    locker: number;
    text?: string;
    dark?: boolean;
  }
}

export { INewsroomPanelLockMask };
