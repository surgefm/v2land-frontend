import { WithTranslation } from 'next-i18next';

declare namespace ITagHead {
  export interface IProps extends WithTranslation {
    title?: string;
    tagId: number;
  }
}

export { ITagHead };
