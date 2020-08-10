const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const fullMonths = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

type GetTimeStringOptions = {
  showWeekday?: boolean;
  forceShowYear?: boolean;
  withSpaceBetween?: boolean;
  showMonthOnly?: boolean;
  showFullMonth?: boolean;
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
    showFullMonth = true,
  } = options;

  if (!t) return '';
  let time: Date;
  try {
    time = new Date(t);
  } catch (err) {
    return '';
  }

  const year = time.getFullYear();
  const month = time.getMonth();
  const date = time.getDate();
  const weekday = weekdays[time.getDay()];
  const space = withSpaceBetween ? ' ' : '';
  let showYear = forceShowYear;
  showYear = forceShowYear ? showYear : year !== new Date().getFullYear();

  let str = showFullMonth ? fullMonths[month] : months[month];
  if (!showMonthOnly) str += `${space}${date}`;
  if (showYear) {
    if (!showMonthOnly) str += ',';
    str += `${space}${year}`;
  }
  if (showWeekday) {
    str += ` ${weekday}`;
  }
  return str;
};
