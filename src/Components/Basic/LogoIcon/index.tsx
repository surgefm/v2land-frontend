import React from 'react';
import Icon from '@ant-design/icons';
import { CustomIconComponentProps } from '@ant-design/icons/lib/components/Icon';

const LogoSvg = () => (
  <svg
    width="0.94921875em"
    height="1em"
    viewBox="0 0 243 256"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
      <g id="Custom-Preset-2" transform="translate(-7.000000, 0.000000)">
        <g id="Group" transform="translate(7.000000, 0.000000)">
          <polygon
            id="wave-1"
            fill="#2574A9"
            transform="translate(84.645161, 82.064516) scale(-1, 1) translate(-84.645161, -82.064516) "
            points="0 0 84.6451613 0 169.290323 164.129032 84.6451613 164.129032"
          />
          <polygon
            id="wave-2"
            fill="#19B5FE"
            transform="translate(121.806452, 127.483871) scale(-1, 1) translate(-121.806452, -127.483871) "
            points="37.1612903 45.4193548 121.806452 45.4193548 206.451613 209.548387 121.806452 209.548387"
          />
          <polygon
            id="wave-3"
            fill="#81CFE0"
            transform="translate(157.935484, 173.935484) scale(-1, 1) translate(-157.935484, -173.935484) "
            points="73.2903226 91.8709677 157.935484 91.8709677 242.580645 256 157.935484 256"
          />
        </g>
      </g>
    </g>
  </svg>
);

export const LogoIcon = (props: CustomIconComponentProps) => (
  <Icon component={LogoSvg} {...props} />
);
