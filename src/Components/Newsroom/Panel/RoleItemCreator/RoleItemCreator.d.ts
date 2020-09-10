import React from 'react';
import { WithTranslation } from 'next-i18next';

declare namespace INewsroomPanelRoleItemCreator {
  export interface IProps extends WithTranslation {
    eventId: number;
    style?: React.CSSProperties;
  }
}

export { INewsroomPanelRoleItemCreator };
