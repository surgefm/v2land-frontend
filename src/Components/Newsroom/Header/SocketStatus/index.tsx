import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Tag } from 'antd';

import { getActiveNewsroom } from '@Selectors';
import { usePrevious } from '@Services';

export const NewsroomHeaderSocketStatus: React.FunctionComponent = () => {
  const newsroom = useSelector(getActiveNewsroom);
  const prevStatus = usePrevious(newsroom ? newsroom.socketStatus : null);
  const [timer1, setTimer1] = useState(0);
  const [timer2, setTimer2] = useState(0);
  const [display, setDisplay] = useState('block');
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    if (!newsroom) return;
    if (newsroom.socketStatus !== prevStatus) {
      clearTimeout(timer1);
      clearTimeout(timer2);
      setOpacity(1);
      setDisplay('block');
      if (newsroom.socketStatus === 'connected') {
        setTimer1(setTimeout(() => setOpacity(0), 4000));
        setTimer2(setTimeout(() => setDisplay('none'), 5000));
      }
    }
  }, [newsroom]);

  let label = '';
  let color = 'blue';
  if (!newsroom || newsroom.socketStatus === 'connecting') {
    label = '正在连接服务器';
  } else if (newsroom.socketStatus === 'disconnected') {
    label = '无法连接服务器';
    color = 'red';
  } else if (newsroom.socketStatus === 'connected') {
    label = '已连接到服务器';
  } else {
    return <React.Fragment />;
  }

  return (
    <Tag style={{ display, opacity, transition: 'opacity 0.3s' }} color={color}>
      {label}
    </Tag>
  );
};
