declare namespace INewsForm {
  export interface IProps {
    eventId: number;
    newsId?: number;
    useSocket?: boolean;
    onOk?: Function;
    onCancel?: Function;
    disabled?: boolean;
  }
}

export { INewsForm };
