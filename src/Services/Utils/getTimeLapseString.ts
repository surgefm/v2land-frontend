import { TFunction } from 'next-i18next';

const BEIJING_OFFSET = 8 * 60; // UTC+8 in minutes

function toBeijingDate(date: Date): Date {
  const utc = date.getTime() + date.getTimezoneOffset() * 60000;
  return new Date(utc + BEIJING_OFFSET * 60000);
}

function clearHour(time: Date) {
  time.setHours(0);
  time.setMinutes(0);
  time.setSeconds(0);
  time.setMilliseconds(0);
}

export const getTimeLapseString = (
  tf: TFunction,
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
  if (type !== 'general') {
    if (secondDiff < 120) return tf('Utils_TimeLapse_JustHappened');
    if (secondDiff < 3600)
      return tf('Utils_TimeLapse_MinutesAgo', {
        minutes: Math.floor(secondDiff / 60),
      });
  }

  const bjNow = toBeijingDate(now);
  const bjTime = toBeijingDate(time);
  clearHour(bjNow);
  clearHour(bjTime);
  const dayDiff = Math.floor((bjNow.getTime() - bjTime.getTime()) / 1000 / 60 / 60 / 24);
  if (dayDiff === 0) return tf('Utils_TimeLapse_Today');
  if (type !== 'general' && secondDiff < 3600 * 24) {
    return tf('Utils_TimeLapse_HoursAgo', {
      hours: Math.floor(secondDiff / 3600),
    });
  }
  if (dayDiff === 1) return tf('Utils_TimeLapse_Yesterday');
  if (type !== 'general') return tf('Utils_TimeLapse_DaysAgo', { days: dayDiff });

  if (dayDiff <= 3) return tf('Utils_TimeLapse_DayBeforeYesterday');
  if (dayDiff <= 7) return tf('Utils_TimeLapse_ThreeDaysAgo');
  if (dayDiff <= 13) return tf('Utils_TimeLapse_OneWeekAgo');
  if (dayDiff <= 31) return tf('Utils_TimeLapse_TwoWeeksAgo');
  if (dayDiff <= 61) return tf('Utils_TimeLapse_OneMonthAgo');
  if (dayDiff <= 92) return tf('Utils_TimeLapse_TwoMonthsAgo');
  if (dayDiff <= 183) return tf('Utils_TimeLapse_ThreeMonthsAgo');
  if (dayDiff <= 365) return tf('Utils_TimeLapse_HalfAYearAgo');
  return tf('Utils_TimeLapse_YearsAgo', {
    years: Math.floor(dayDiff / 365),
    count: Math.floor(dayDiff / 365),
  });
};
