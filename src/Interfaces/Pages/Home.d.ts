// #region Global Imports
import { WithTranslation } from 'next-i18next';
// #endregion Global Imports

import { Tag } from '@Interfaces/Models/Tag';

declare namespace IHomePage {
  export interface IProps extends WithTranslation {
    tagList: Tag[];
  }

  export interface InitialProps {
    namespacesRequired: string[];
    tagList: Tag[];
  }

  export interface IStateProps {
    home: {
      version: number;
    };
    image: {
      url: string;
    };
  }

  namespace Actions {
    export interface IMapPayload {}

    export interface IMapResponse {}
  }
}

export { IHomePage };
