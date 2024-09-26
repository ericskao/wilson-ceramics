import { format } from 'date-fns';
import { fromZonedTime } from 'date-fns-tz';

const TIMEZONE = 'America/Los_Angeles';

export function toPST(date: string) {
  return fromZonedTime(date, TIMEZONE);
}

export function formatPST(date: string, formatStr = 'PPPP') {
  const pstDate = toPST(date);
  return format(pstDate, formatStr);
}

export function weekDatesWithOffset(weekOffset: string | null) {
  const offset = Number(weekOffset) || 0;
  const today = new Date();
  const startOfWeek = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - today.getDay() + 7 * Number(offset)
  );
  const endOfWeek = new Date(
    startOfWeek.getFullYear(),
    startOfWeek.getMonth(),
    startOfWeek.getDate() + 6
  );

  // Format dates as YYYY-MM-DD
  const startDate = startOfWeek.toISOString().split('T')[0];
  const endDate = endOfWeek.toISOString().split('T')[0];

  return {
    startDate,
    endDate,
  };
}
