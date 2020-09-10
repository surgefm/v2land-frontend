import { WithTranslation } from 'next-i18next';

declare namespace IHead {
  export interface IProps extends WithTranslation {
    title?: string;
    showSlogan?: boolean;
  }
}

export { IHead };
