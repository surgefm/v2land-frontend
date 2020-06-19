declare module '*.scss' {
  interface IClassNames {
    [className: string]: string;
  }
  const classNames: IClassNames;
  export = classNames;
}

declare module 'react-stack-grid' {
  import React from 'react';

  export = React.Component;
}
