// #region Global Imports
import { WithTranslation } from 'next-i18next';
// #endregion Global Imports

declare namespace IClientPage {
  export interface IProps extends WithTranslation {
    clientId: number;
  }

  export interface InitialProps {
    namespacesRequired: string[];
    clientId?: number;
  }

  export interface IStateProps {}
}

export { IClientPage };
