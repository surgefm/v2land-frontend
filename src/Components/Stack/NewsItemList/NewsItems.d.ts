import { WithTranslation } from 'next-i18next';

declare namespace INewsItemList {
  export interface IProps extends WithTranslation {
    newsIdList: number[];
  }
}

export { INewsItemList };
