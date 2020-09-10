// #region Global Imports
import { WithTranslation } from 'next-i18next';
// #endregion Global Imports

declare namespace IRegisterPage {
  export interface IProps extends WithTranslation {}

  export interface InitialProps {
    namespacesRequired: string[];
  }
}

export { IRegisterPage };
