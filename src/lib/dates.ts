/**
 * Date helpers.
 *
 * Everything works in the browser's local time zone. On a wall tablet in the house
 * that is the same zone Home Assistant runs in, which keeps the arithmetic simple and
 * avoids shipping a date library.
 */
import type { HomeAssistant } from './types';

/** 0 = Sunday … 6 = Saturday, matching `Date.prototype.getDay()`. */
export type WeekdayIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6;

const WEEKDAY_NAMES = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
];

export function startOfDay(date: Date): Date {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

export function addDays(date: Date, days: number): Date {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
}

export function addMonths(date: Date, months: number): Date {
  const copy = new Date(date);
  // Snap to the 1st first, so adding a month to the 31st cannot skip one.
  copy.setDate(1);
  copy.setMonth(copy.getMonth() + months);
  return copy;
}

export function startOfMonth(date: Date): Date {
  const copy = startOfDay(date);
  copy.setDate(1);
  return copy;
}

export function startOfWeek(date: Date, firstDay: WeekdayIndex): Date {
  const copy = startOfDay(date);
  return addDays(copy, -((copy.getDay() - firstDay + 7) % 7));
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

/** Local `YYYY-MM-DD`. Deliberately not `toISOString()`, which shifts to UTC. */
export function toDateKey(date: Date): string {
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

export function fromDateKey(key: string): Date {
  const [year, month, day] = key.split('-').map(Number);
  return new Date(year, month - 1, day);
}

/** Local `YYYY-MM-DD HH:MM:SS`, the format `calendar.create_event` expects. */
export function toDateTimeString(date: Date): string {
  const pad = (value: number) => `${value}`.padStart(2, '0');
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
    `${pad(date.getHours())}:${pad(date.getMinutes())}:00`
  );
}

/** `HH:MM` for `<input type="time">`. */
export function toTimeValue(date: Date): string {
  const pad = (value: number) => `${value}`.padStart(2, '0');
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

/**
 * The first day of the week for this user.
 *
 * Home Assistant's `first_weekday` may be the literal "language", in which case we ask
 * the browser. `Intl.Locale.weekInfo` is not available everywhere, hence the fallback.
 */
export function firstWeekday(hass: HomeAssistant): WeekdayIndex {
  const configured = hass.locale?.first_weekday;
  if (configured && configured !== 'language') {
    const index = WEEKDAY_NAMES.indexOf(configured);
    if (index >= 0) {
      return index as WeekdayIndex;
    }
  }

  try {
    // weekInfo.firstDay is 1 (Monday) … 7 (Sunday).
    const locale = new Intl.Locale(hass.locale?.language || hass.language || 'en');
    const week = (locale as unknown as { weekInfo?: { firstDay?: number } }).weekInfo;
    if (week?.firstDay) {
      return (week.firstDay % 7) as WeekdayIndex;
    }
  } catch {
    // Older browsers: fall through to Monday.
  }
  return 1;
}

/** Whether the user wants a 12-hour clock; `undefined` means "let the locale decide". */
export function prefersHour12(hass: HomeAssistant): boolean | undefined {
  switch (hass.locale?.time_format) {
    case '12':
      return true;
    case '24':
      return false;
    default:
      return undefined;
  }
}

export function localeOf(hass: HomeAssistant): string {
  return hass.locale?.language || hass.language || 'en';
}

/** The [start, end) range a month view covers, padded to whole weeks. */
export function monthGridRange(
  anchor: Date,
  firstDay: WeekdayIndex,
): { start: Date; end: Date; weeks: number } {
  const start = startOfWeek(startOfMonth(anchor), firstDay);
  const monthEnd = addMonths(startOfMonth(anchor), 1);
  // Pad to a whole number of weeks, always showing at least six so the grid does not
  // change height as the user pages through the year.
  let end = startOfWeek(addDays(monthEnd, -1), firstDay);
  end = addDays(end, 7);
  let weeks = Math.round((end.getTime() - start.getTime()) / (7 * 86_400_000));
  if (weeks < 6) {
    end = addDays(end, 7 * (6 - weeks));
    weeks = 6;
  }
  return { start, end, weeks };
}
