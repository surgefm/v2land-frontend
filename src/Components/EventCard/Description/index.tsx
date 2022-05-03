import React from 'react';
import { Typography } from 'antd';

import commonStyles from '@Static/css/common.module.scss';
import { IEventCardDescription } from './Description';

const { Paragraph } = Typography;

export const EventCardDescription: React.FunctionComponent<IEventCardDescription.IProps> = ({
  children,
  styles,
  className,
}) => (
  <Paragraph
    className={`description ${commonStyles['light-font']} ${className || ''}`}
    ellipsis={{ rows: 4, expandable: false }}
    style={{
      ...styles,
      lineHeight: 1.8,
      marginTop: '0.5rem',
      marginBottom: '0rem',
      padding: 0,
    }}
  >
    {children}
  </Paragraph>
);
