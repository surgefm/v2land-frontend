import { Tag } from '@Interfaces/Models/Tag';

declare namespace ITagsPage {
  export interface IProps {
    tags: { [index: string]: Tag[] };
  }

  export interface InitialProps {
    tags: { [index: string]: Tag[] };
    namespaceRequired: string[];
  }
}

export { ITagsPage };
