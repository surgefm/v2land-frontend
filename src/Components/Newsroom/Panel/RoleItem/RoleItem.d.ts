import React from 'react';
import { WithTranslation } from 'next-i18next';

declare namespace INewsroomPanelRoleItem {
  export interface IProps extends WithTranslation {
    clientId: number;
    eventId: number;
    style?: React.CSSProperties;
  }
}

export { INewsroomPanelRoleItem };
