import { WithTranslation } from 'next-i18next';

declare namespace IEventStats {
  export interface IProps extends WithTranslation {
    stackCount?: number;
    newsCount?: number;
  }
}

export { IEventStats };
