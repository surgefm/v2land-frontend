import React from 'react';

declare namespace ITagForm {
  export interface IProps {
    tagId: number;
    onCancel?: React.MouseEventHandler<HTMLElement>;
    onOk?: React.MouseEventHandler<HTMLElement>;
  }
}

export { ITagForm };
