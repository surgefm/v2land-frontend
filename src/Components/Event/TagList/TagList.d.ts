import { WithTranslation } from 'next-i18next';

declare namespace IEventTagList {
  export interface IProps extends WithTranslation {
    tagIdList: number[];
  }
}

export { IEventTagList };
