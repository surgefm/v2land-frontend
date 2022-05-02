declare namespace IEventPage {
  export interface IProps {
    eventId: number;
  }

  export interface InitialProps {
    namespacesRequired: string[];
    eventId?: number;
  }

  export interface IStateProps {
    eventId: number;
  }
}

export { IEventPage };
