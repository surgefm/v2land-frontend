import { WithTranslation } from 'next-i18next';

declare namespace IStack {
  export interface IProps extends WithTranslation {
    stackId: number;
    isLatestStack?: boolean;
    displayOrder?: boolean;
    showEventName?: boolean;
  }
}

export { IStack };
