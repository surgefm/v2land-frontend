import { WithTranslation } from 'next-i18next';

declare namespace IClientAvatarEditor {
  export interface IProps extends WithTranslation {
    clientId: number;
    onChange?: (value: string) => void | Promise<void>;
  }
}

export { IClientAvatarEditor };
