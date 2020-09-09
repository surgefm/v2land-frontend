import { WithTranslation } from 'next-i18next';

declare namespace IEventContributorList {
  export interface IProps extends WithTranslation {
    contributorList?: number[];
    eventId?: number;
  }
}

export { IEventContributorList };
