import { WithTranslation } from 'next-i18next';

declare namespace INewsroomPanelStackList {
  export interface IProps extends WithTranslation {
    stackIdList: number[];
    droppableId?: string;
  }
}

export { INewsroomPanelStackList };
