import { useTranslation } from '@I18n';

declare namespace IStackForm {
  export interface IProps {
    eventId: number;
    stackId?: number;
    useSocket?: boolean;
    onOk?: Function;
    onCancel?: Function;
    disabled?: boolean;
  }
}

export { IStackForm };
