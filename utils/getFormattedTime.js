export default function getFormattedTime(time) {
  if (!time) return;
  let newTime = new Date(time).getTime();
  const minutesOffset = new Date().getTimezoneOffset() + 480;
  newTime += minutesOffset * 60000;
  return new Date(newTime);
}
