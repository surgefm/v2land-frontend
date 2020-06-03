function clearHour(time: Date) {
  time.setHours(0);
  time.setMinutes(0);
  time.setSeconds(0);
  time.setMilliseconds(0);
}

function getSecond(time: Date) {
  return Math.floor(time.getTime() / 1000);
}

export const getTimeLapseString = (
  t?: string | Date,
  type: 'specific' | 'general' = 'specific'
) => {
  if (!t) return '';
  let time = t as Date;
  try {
    if (typeof t === 'string') time = new Date(t);
  } catch (err) {
    return '';
  }

  const now = new Date();
  const nowTimestamp = Math.floor(now.getTime() / 1000);
  const timestamp = Math.floor(time.getTime() / 1000);
  const secondDiff = nowTimestamp - timestamp;
  if (secondDiff < 0) return '未来';
  if (type !== 'general') {
    if (secondDiff < 60) return '刚刚';
    if (secondDiff < 3600) return `${Math.floor(secondDiff / 60)} 分钟前`;
  }

  clearHour(now);
  clearHour(time);
  const dayDiff = Math.floor((getSecond(now) - getSecond(time)) / 60 / 60 / 24);
  if (dayDiff === 0) return '今天';
  if (type !== 'general' && secondDiff < 3600 * 24) {
    return `${Math.floor(secondDiff / 3600)} 小时前`;
  }
  if (dayDiff === 1) return '昨天';
  if (type !== 'general') return `${dayDiff} 天前`;

  if (dayDiff <= 3) return '前天';
  if (dayDiff <= 7) return '三天前';
  if (dayDiff <= 31) return '一周前';
  if (dayDiff <= 92) return '一个月前';
  if (dayDiff <= 183) return '三个月前';
  if (dayDiff <= 365) return '半年前';
  return `${Math.floor(dayDiff / 365)} 年前`;
};
