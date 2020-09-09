import { WithTranslation } from 'next-i18next';

declare namespace INewsroomPanelStackCard {
  export interface IProps extends WithTranslation {
    stackId: number;
    index?: number;
    dark?: boolean;
  }
}

export { INewsroomPanelStackCard };
