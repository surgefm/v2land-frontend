/**
 * 将北京时间转为客户端当地时间，以便显示为北京时间
 * @file getLocalTime.js
 */

export default function getLocalTime(time) {
  if (!time) return;
  let newTime = new Date(time).getTime();
  // 获取客户端所在地区与东八区所差的分钟数
  const minutesOffset = new Date().getTimezoneOffset() + 480;
  newTime += minutesOffset * 60000;
  return new Date(newTime);
}
