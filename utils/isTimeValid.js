export default function isTimeValid(time) {
  if (!time) return;
  const offset = (new Date().getTimezoneOffset() + 480) * 60000 * 2;
  return time.getTime() <= Date.now() + offset;
}
