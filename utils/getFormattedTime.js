/**
 * 将用户输入时间转为东八区时间
 * @file getFormattedTime.js
 *
 * @param {string | Date} time
 */

export default function getFormattedTime(time) {
  if (!time) return;
  let newTime = new Date(time).getTime();
  // 获取客户端所在地区与东八区所差的分钟数
  const minutesOffset = new Date().getTimezoneOffset() + 480;
  newTime += minutesOffset * 60000;
  return new Date(newTime);
}
