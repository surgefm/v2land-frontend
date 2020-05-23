declare namespace IStackForm {
  export interface IProps {
    eventId: number;
    stackId?: number;
    useSocket?: boolean;
    onOk?: Function;
    onCancel?: Function;
  }
}

export { IStackForm };
