/**
 * 确认进展/新闻时间在过去
 * @file isTimeValid.js
 *
 * @param {String | Date} time
 */

export default function isTimeValid(time) {
  if (!time) return;
  if (!time.getTime) {
    time = new Date(time);
  }
  // 获取客户端与东八区的时差
  const offset = (new Date().getTimezoneOffset() + 480) * 60000;
  return time.getTime() <= Date.now() + offset;
}
