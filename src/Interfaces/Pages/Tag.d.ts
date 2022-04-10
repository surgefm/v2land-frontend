declare namespace ITagPage {
  export interface IProps {
    tagId: number;
  }

  export interface InitialProps {
    tagId: number;
    namespaceRequired: string[];
  }
}

export { ITagPage };
