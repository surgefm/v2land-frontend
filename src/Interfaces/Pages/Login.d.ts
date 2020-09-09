// #region Global Imports
import { WithTranslation } from 'next-i18next';
// #endregion Global Imports

declare namespace ILoginPage {
  export interface IProps extends WithTranslation {}

  export interface InitialProps {
    namespacesRequired: string[];
  }
}

export { ILoginPage };
