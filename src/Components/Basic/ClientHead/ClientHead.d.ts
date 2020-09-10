import { WithTranslation } from 'next-i18next';

declare namespace IClientHead {
  export interface IProps extends WithTranslation {
    title?: string;
    clientId: number;
  }
}

export { IClientHead };
