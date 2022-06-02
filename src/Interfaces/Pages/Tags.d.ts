import { Tag } from '@Interfaces/Models/Tag';

declare namespace ITagsPage {
  export type TagGraph = {
    title?: number;
    key: number;
    children: TagGraph;
  }[];

  export interface IProps {
    tags: { [index: string]: Tag[] };
    graph: TagGraph;
  }

  export interface InitialProps {
    tags: { [index: string]: Tag[] };
    graph: TagGraph;
    namespaceRequired: string[];
  }
}

export { ITagsPage };
