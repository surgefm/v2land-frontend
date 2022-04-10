import React from 'react';
import { useTranslation } from '@I18n';

declare namespace INewsroomPanelNewsList {
  export interface IProps {
    newsIdList: number[];
    droppableId?: string;
    isNested?: boolean;
    style?: React.CSSProperties;
  }
}

export { INewsroomPanelNewsList };
