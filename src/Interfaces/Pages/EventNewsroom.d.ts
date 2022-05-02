// #region Global Imports
import { useTranslation } from '@I18n';
// #endregion Global Imports

declare namespace IEventNewsroomPage {
  export interface IProps {
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
