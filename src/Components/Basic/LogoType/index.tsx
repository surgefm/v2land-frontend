import React from 'react';
import { ILogoType } from './LogoType';

export const LogoType: React.FunctionComponent<ILogoType.IProps> = ({
  className,
  height,
  color,
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 109.08 45.36"
      className={className || 'logotype'}
      height={height || 48}
      width={((height || 48) * 109.08) / 45.36}
    >
      <g id="Layer_2" data-name="Layer 2">
        <g id="logotype">
          <g id="black-singleline">
            <path
              style={{ fill: color || '#333' }}
              d="M21,13.61H36.1l.27-3a.34.34,0,0,0-.34-.37H21.58a.34.34,0,0,0-.34.31ZM8.37,23.48A36.65,36.65,0,0,0,1,17.71l3.71-3.9A55.62,55.62,0,0,1,11.09,18a1.68,1.68,0,0,1,.09,2.47Zm4.36,5.2C10.45,33.78,7.58,39.12,5,43.84L0,40.52c2.06-3.22,5-8.23,7.42-13.19a1.79,1.79,0,0,1,2.64-.73ZM10.81,11.55a37.16,37.16,0,0,0-6.27-6.4L8.65,1.64A45.33,45.33,0,0,1,14.1,6.36a1.72,1.72,0,0,1-.22,2.46Zm31.61,19.2a37.91,37.91,0,0,1-5.11,3.13,1.71,1.71,0,0,0-.2,2.91,22.18,22.18,0,0,0,6.45,3,22.65,22.65,0,0,0-3.24,3.74,1.81,1.81,0,0,1-2.14.69c-7.37-3.11-11.11-9.11-13-17.52H19.68l-1,11,6.15-1.75a1.55,1.55,0,0,1,2,1.38c.08,1.15.22,2.31.33,3.06-7.89,2.44-11.1,3.51-12.77,4.27a1.61,1.61,0,0,1-2.1-.64,13.62,13.62,0,0,0-1.95-2.76,7.42,7.42,0,0,0,2.71-5.1L15.83,5.2h7a3.05,3.05,0,0,0,2.86-4.12v0l4-1A1.58,1.58,0,0,1,31.55,1,33.85,33.85,0,0,1,32.87,5.2h8.06a1.54,1.54,0,0,1,1.56,1.7L40.76,26.66H30.6a19.22,19.22,0,0,0,2,4.81A56.39,56.39,0,0,0,37.83,28a1.66,1.66,0,0,1,2.28.13ZM20.68,21.61H35.12a.33.33,0,0,0,.34-.31l.27-3.07H20.6l-.26,3A.34.34,0,0,0,20.68,21.61Z"
            />
            <path
              style={{ fill: color || '#333' }}
              d="M70.67,22.47a45.24,45.24,0,0,0-7-5.88l3.73-3.7a50.76,50.76,0,0,1,6,4.27,1.7,1.7,0,0,1,0,2.47ZM62.38,42.25c1.85-3.6,4.37-9.12,6.46-14.47a1.84,1.84,0,0,1,2.64-1L74,28.45C72,34,69.53,40,67.25,44.92Zm8-41.7a44.33,44.33,0,0,1,5.35,4.7,1.74,1.74,0,0,1-.25,2.48l-3,2.59a33,33,0,0,0-6.2-6.42ZM106,38.9c-.23,2.57-.76,4.17-2.29,5.1a10.66,10.66,0,0,1-5.15,1,1.55,1.55,0,0,1-1.61-1.4A18.42,18.42,0,0,0,96,39.58c1.65.09,3.4,0,4,0s.8-.19.86-.87l.69-7.95A1.55,1.55,0,0,0,100,29.08H97.5c-.87,5-2.34,10.41-4.85,14.57a1.81,1.81,0,0,1-2.63.59,16.35,16.35,0,0,0-2.64-1.8,1.13,1.13,0,0,0,.1-.13,3.22,3.22,0,0,0-2.6-5.12h0l-.72,8.17H80.64a1.55,1.55,0,0,1-1.57-1.72l.56-6.45H73l.44-5h6.66l.26-3h-6l1.16-13.29a3.43,3.43,0,0,1,3.43-3.14h2.83L82,9.93H76.18l.44-5h2.67a3.43,3.43,0,0,0,3.43-3.14L82.87.21h3.52A1.55,1.55,0,0,1,88,1.93L87.7,5h4A1.55,1.55,0,0,1,93.23,6.7L93,9.93H87.26L87,12.75h4.07a1.55,1.55,0,0,1,1.57,1.72L91.37,29.18H85.58l-.26,3h4.11A1.55,1.55,0,0,1,91,33.86l-.16,1.88a65.24,65.24,0,0,0,2.51-14.29L95.08,1.67H107.5a1.55,1.55,0,0,1,1.57,1.72ZM80.88,19.12h6.27l.22-2.53H81.1Zm-.54,6.17h6.27l.22-2.53H80.56Zm21.84-1.36.38-4.36A1.55,1.55,0,0,0,101,17.85H98.72l-.31,3.6c-.07.78-.14,1.6-.27,2.48ZM99.69,6.82l-.52,5.88h4l.36-4.16A1.55,1.55,0,0,0,102,6.82Z"
            />
          </g>
        </g>
      </g>
    </svg>
  );
};
