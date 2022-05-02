import { InviteCode } from '../Models/InviteCode';

declare namespace ISettingsPage {
  export interface IProps {
    invites: InviteCode[];
  }

  export interface InitialProps {
    namespacesRequired: string[];
    invites: InviteCode[];
  }
}

export { ISettingsPage };
