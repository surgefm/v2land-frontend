import { WithTranslation } from 'next-i18next';

declare namespace ITagPage {
  export interface IProps extends WithTranslation {
    tagId: number;
  }

  export interface InitialProps {
    tagId: number;
    namespaceRequired: string[];
  }
}

export { ITagPage };
