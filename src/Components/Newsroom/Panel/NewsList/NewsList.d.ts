import React from 'react';
import { WithTranslation } from 'next-i18next';

declare namespace INewsroomPanelNewsList {
  export interface IProps extends WithTranslation {
    newsIdList: number[];
    droppableId?: string;
    isNested?: boolean;
    style?: React.CSSProperties;
  }
}

export { INewsroomPanelNewsList };
