import { Client } from '../Models/Client';

declare namespace IRegisterPage {
  export interface IProps {
    invite?: {
      ownerId: number;
    };
    inviter?: Client;
  }

  export interface InitialProps {
    namespacesRequired: string[];
    invite?: {
      ownerId: number;
    };
    inviter?: Client;
  }
}

export { IRegisterPage };
