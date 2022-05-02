declare namespace IClientAvatarEditor {
  export interface IProps {
    clientId: number;
    onChange?: (value: string) => void | Promise<void>;
  }
}

export { IClientAvatarEditor };
