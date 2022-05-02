declare namespace IClientPage {
  export interface IProps {
    clientId: number;
  }

  export interface InitialProps {
    namespacesRequired: string[];
    clientId?: number;
  }

  export interface IStateProps {}
}

export { IClientPage };
