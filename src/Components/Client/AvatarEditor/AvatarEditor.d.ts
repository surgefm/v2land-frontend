declare namespace IClientAvatarEditor {
  export interface IProp {
    clientId: number;
    onChange?: (value: string) => void | Promise<void>;
  }
}

export { IClientAvatarEditor };
