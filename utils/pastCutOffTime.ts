import { isAfter } from 'date-fns';
import { format, fromZonedTime } from 'date-fns-tz';

export function pastCutOffTime() {
  const now = new Date();
  const timezone = 'America/Los_Angeles';
  const currentTimeInPST = fromZonedTime(now, timezone);
  const cutoffTime = '17:45';
  const todayDateString = format(currentTimeInPST, 'yyyy-MM-dd');
  const todayCutoffString = `${todayDateString}T${cutoffTime}:00`;
  const todayCutoff = fromZonedTime(todayCutoffString, timezone);

  return isAfter(currentTimeInPST, todayCutoff);
}
