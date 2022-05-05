import { getTranslation } from '@I18n';

type GetTimeStringOptions = {
  showWeekday?: boolean;
  forceShowYear?: boolean;
  withSpaceBetween?: boolean;
  showMonthOnly?: boolean;
  showFullMonth?: boolean;
};

const oneThruTwelve: number[] = [];
for (let i = 1; i <= 12; i += 1) oneThruTwelve.push(i);

/**
 * @param {Date|String|Number} time 时间
 */
export const getTimeStringEn = (t?: string | Date | number, options: GetTimeStringOptions = {}) => {
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
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

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

/**
 * @param {Date|String|Number} time 时间
 */
export const getTimeStringCn = (t?: string | Date | number, options: GetTimeStringOptions = {}) => {
  const {
    showWeekday = false,
    forceShowYear = false,
    withSpaceBetween = true,
    showMonthOnly = false,
  } = options;

  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  const fullMonths = [
    '一月',
    '二月',
    '三月',
    '四月',
    '五月',
    '六月',
    '七月',
    '八月',
    '九月',
    '十月',
    '十一月',
    '十二月',
  ];
  const space = withSpaceBetween ? ' ' : '';
  const months = oneThruTwelve.map(month => `${month}${space}月`);

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
  let showYear = forceShowYear;
  showYear = forceShowYear ? showYear : year !== new Date().getFullYear();

  let str = showMonthOnly ? fullMonths[month] : months[month];
  if (!showMonthOnly) str += `${space}${date}${space}日`;
  if (showYear) {
    str = `${year}${space}年${showMonthOnly ? '' : space}${str}`;
  }
  if (showWeekday) {
    str += ` ${weekday}`;
  }
  return str;
};

export const getTimeString = (t?: string | Date | number, options: GetTimeStringOptions = {}) => {
  const { i18next } = getTranslation('common');
  const locale = i18next.language;
  if (locale === 'en') return getTimeStringEn(t, options);
  return getTimeStringCn(t, options);
};
