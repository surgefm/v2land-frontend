import React from 'react';

declare namespace IFlow {
  export interface IProps {
    Component: React.FC<any>;
    elementProps: Record[];
    numLine?: number;
  }
}

export { IFlow };
