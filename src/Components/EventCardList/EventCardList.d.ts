import { WithTranslation } from 'next-i18next';

declare namespace IEventCardList {
  export interface IProps extends WithTranslation {
    className?: string;
  }
}

export { IEventCardList };
