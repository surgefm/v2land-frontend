// #region Global Imports
import { WithTranslation } from 'next-i18next';
// #endregion Global Imports

declare namespace IEventNewsroomPage {
  export interface IProps extends WithTranslation {}

  export interface InitialProps {
    namespacesRequired: string[];
  }

  export interface IStateProps {
    eventId: number;
  }
}

export { IEventNewsroomPage };
