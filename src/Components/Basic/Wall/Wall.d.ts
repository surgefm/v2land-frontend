import React from 'react';

declare namespace IWall {
  export interface IProps {
    Component: React.FC<any>;
    elementProps: Record[];
    elementWidth?: number;
    gutterWidth?: number;
    marginWidth?: number;
    onSetColumns?: (numColumns: number) => any;
  }
}

export { IWall };
