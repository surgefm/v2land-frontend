import { WithTranslation } from 'next-i18next';

declare namespace ITimelineCard {
  export interface IProps extends WithTranslation {
    eventId: number;
  }
}

export { ITimelineCard };
