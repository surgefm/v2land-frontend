const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

type GetTimeStringOptions = {
  showWeekday?: boolean;
  forceShowYear?: boolean;
  withSpaceBetween?: boolean;
  showMonthOnly?: boolean;
};

/**
 * @param {Date|String|Number} time 时间
 */
export const getTimeString = (t?: string | Date | number, options: GetTimeStringOptions = {}) => {
  const {
    showWeekday = false,
    forceShowYear = false,
    withSpaceBetween = true,
    showMonthOnly = false,
  } = options;

  if (!t) return '';
  let time: Date;
  try {
    time = new Date(t);
  } catch (err) {
    return '';
  }

  const year = time.getFullYear();
  const month = time.getMonth() + 1;
  const date = time.getDate();
  const weekday = weekdays[time.getDay()];
  const space = withSpaceBetween ? ' ' : '';
  let showYear = forceShowYear;
  showYear = forceShowYear ? showYear : year !== new Date().getFullYear();

  let str = `${month}${space}月`;
  if (!showMonthOnly) str += `${space}${date}${space}日`;
  if (showYear) {
    str = `${space}${year}${space}年${space}${str}`;
  }
  if (showWeekday) {
    str += ` ${weekday}`;
  }
  return str;
};
