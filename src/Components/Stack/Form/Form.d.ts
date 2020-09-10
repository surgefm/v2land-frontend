import { WithTranslation } from 'next-i18next';

declare namespace IStackForm {
  export interface IProps extends WithTranslation {
    eventId: number;
    stackId?: number;
    useSocket?: boolean;
    onOk?: Function;
    onCancel?: Function;
    disabled?: boolean;
  }
}

export { IStackForm };
