declare namespace IClientSelector {
  export interface IProps {
    value?: string;
    disabled?: boolean;
    exceptions?: number[];
    placeholder?: string;
    onChange?: (value: string) => void | Promise<void>;
    onSelect?: (value: string) => void | Promise<void>;
  }
}

export { IClientSelector };
