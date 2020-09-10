import { WithTranslation } from 'next-i18next';

declare namespace IEventHead {
  export interface IProps extends WithTranslation {
    title?: string;
    eventId: number;
  }
}

export { IEventHead };
