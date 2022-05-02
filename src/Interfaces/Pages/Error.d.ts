// #region Global Imports
import { useTranslation } from '@I18n';
// #endregion Global Imports

declare namespace IErrorPage {
  export interface IProps {
    statusCode?: number;
  }

  export interface InitialProps {
    namespacesRequired: string[];
  }
}

export { IErrorPage };
