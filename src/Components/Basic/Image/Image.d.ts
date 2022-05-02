import React from 'react';

declare namespace IImage {
  export interface IProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    src: string;
    alt: string;
  }
}

export { IImage };
