import { Client } from '../Models/Client';
import { InviteCode } from '../Models/InviteCode';

declare namespace IRegisterPage {
  export interface IProps {
    invite?: InviteCode;
    inviter?: Client;
  }

  export interface InitialProps {
    namespacesRequired: string[];
    invite?: InviteCode;
    inviter?: Client;
  }
}

export { IRegisterPage };
