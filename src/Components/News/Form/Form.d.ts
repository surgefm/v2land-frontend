import { News } from '@Interfaces';

declare namespace INewsForm {
  export interface IProps {
    eventId: number;
    newsId?: number;
    useSocket?: boolean;
    onOk?: Function;
    onCancel?: Function;
    disabled?: boolean;
    initialValues?: News;
  }
}

export { INewsForm };
