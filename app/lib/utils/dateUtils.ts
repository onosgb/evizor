import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/en';

// Extend dayjs with required plugins
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);

// Set the default timezone (you can make this configurable if needed)
dayjs.tz.setDefault(dayjs.tz.guess());

// Re-export dayjs as the default
export default dayjs;

// Helper functions for common date operations
export const formatDate = (date: string | Date, format = 'MMM D, YYYY'): string => {
  return dayjs(date).format(format);
};

export const formatDateTime = (date: string | Date, format = 'MMM D, YYYY, hh:mm A'): string => {
  return dayjs(date).format(format);
};

export const formatTime = (date: string | Date, format = 'h:mm A'): string => {
  return dayjs(date).format(format);
};

export const fromNow = (date: string | Date): string => {
  return dayjs(date).fromNow();
};

export const formatTodayOrDate = (date: string | Date, format = 'MMM D, YYYY'): string => {
  const d = dayjs(date);
  const now = dayjs();
  if (d.isSame(now, 'day')) {
    return 'Today';
  }
  return d.format(format);
};
