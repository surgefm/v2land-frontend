declare namespace INewsroomPanelStackCard {
  export interface IProps {
    stackId: number;
    index?: number;
    sourceDroppableId?: string;
    dark?: boolean;
    cardRef?: (el: HTMLDivElement | null) => void;
  }
}

export { INewsroomPanelStackCard };
