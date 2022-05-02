import { InviteCode } from '../Models/InviteCode';

declare namespace IAdminPage {
  export interface IProps {
    invites: InviteCode[];
  }

  export interface InitialProps {
    namespacesRequired: string[];
    invites: InviteCode[];
  }
}

export { IAdminPage };
