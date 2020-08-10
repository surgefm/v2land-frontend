import { WithTranslation } from 'next-i18next';

declare namespace ITagHeaderCard {
  export interface IProps extends WithTranslation {
    tagId: number;
    createTimelineMode?: boolean;
    onCreateTimeline?: () => void;
  }
}

export { ITagHeaderCard };
