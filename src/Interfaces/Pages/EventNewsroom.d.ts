// #region Global Imports
import { WithTranslation } from 'next-i18next';
// #endregion Global Imports

declare namespace IEventNewsroomPage {
  export interface IProps extends WithTranslation {
    eventId: number;
  }

  export interface InitialProps {
    namespacesRequired: string[];
    eventId?: number;
  }

  export interface IStateProps {
    eventId: number;
  }
}

export { IEventNewsroomPage };
