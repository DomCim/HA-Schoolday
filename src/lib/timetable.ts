/**
 * Reading the school timetable out of the Schoolday sensors.
 *
 * The grid — when the periods are, where the breaks fall, what colour a subject has —
 * is published once on the board sensor. Each member's own week rides on their member
 * sensor, so neither attribute set grows with the size of the family.
 */
import { localeOf, prefersHour12 } from './dates';
import type { HassEntity, HomeAssistant } from './types';

export interface TimetablePeriod {
  index: number;
  /** `HH:MM`, 24-hour, exactly as it was configured. */
  start: string;
  end: string;
  startMinutes: number;
  endMinutes: number;
}

export interface TimetableBreak {
  /** The break follows this period. */
  after: number;
  start: string;
  end: string;
  minutes: number;
}

export interface TimetableGrid {
  periods: TimetablePeriod[];
  breaks: TimetableBreak[];
  /** subject -> colour, already resolved by the integration. */
  subjects: Record<string, string>;
}

export interface TimetableLesson {
  period: number;
  subject: string;
  room: string | null;
}

/** weekday (0 = Monday) -> that day's lessons, in period order. */
export type TimetableWeek = Record<number, TimetableLesson[]>;

/** What kind of day a member is having. Mirrors MODE_* in the integration. */
export type DayMode = 'school' | 'care' | 'free';

/** One dated day: which day it is, and what it actually holds. */
export interface OutlookDay {
  /** `YYYY-MM-DD`. */
  date: string;
  /** 0 = Monday, matching the timetable's own numbering. */
  weekday: number;
  mode: DayMode;
  /** The holiday's name or the care event's title; null on a school day. */
  label: string | null;
}

/**
 * This week and the days still to come, in date order.
 *
 * A timetable repeats forever, so on its own a column can only say what a Tuesday is
 * usually like. This says which Tuesday, and whether it is happening at all. The
 * window reaches back to Monday, so a weekday can appear twice — see `dayFor`.
 */
export type Outlook = OutlookDay[];

/** A row of the rendered table: a period, or the break that follows one. */
export type TimetableRow =
  | { kind: 'period'; period: TimetablePeriod }
  | { kind: 'break'; gap: TimetableBreak };

/** Minutes since midnight for `HH:MM`. */
export function toMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return (hours || 0) * 60 + (minutes || 0);
}

/** Minutes since midnight, right now. */
export function nowMinutes(now: Date = new Date()): number {
  return now.getHours() * 60 + now.getMinutes();
}

/** Today as 0 = Monday … 6 = Sunday, the numbering the integration stores. */
export function weekdayIndex(date: Date = new Date()): number {
  return (date.getDay() + 6) % 7;
}

/** Render a stored `HH:MM` the way this user reads times. */
export function formatTime(hass: HomeAssistant | undefined, time: string): string {
  if (!hass) {
    return time;
  }
  const hour12 = prefersHour12(hass);
  if (hour12 !== true) {
    // 24-hour is what the value already is; keep it rather than round-trip a Date.
    return time;
  }
  const date = new Date();
  date.setHours(Math.floor(toMinutes(time) / 60), toMinutes(time) % 60, 0, 0);
  return new Intl.DateTimeFormat(localeOf(hass), {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date);
}

/** Parse the `timetable` attribute of the board sensor. */
export function parseGrid(raw: unknown): TimetableGrid | null {
  if (!raw || typeof raw !== 'object') {
    return null;
  }
  const data = raw as Record<string, unknown>;
  const rawPeriods = Array.isArray(data.periods) ? data.periods : [];

  const periods: TimetablePeriod[] = rawPeriods
    .map((entry) => entry as Record<string, unknown>)
    .filter((entry) => typeof entry?.start === 'string' && typeof entry?.end === 'string')
    .map((entry, position) => ({
      index: Number(entry.index ?? position + 1),
      start: String(entry.start),
      end: String(entry.end),
      startMinutes: toMinutes(String(entry.start)),
      endMinutes: toMinutes(String(entry.end)),
    }));

  if (!periods.length) {
    return null;
  }

  const breaks: TimetableBreak[] = (Array.isArray(data.breaks) ? data.breaks : [])
    .map((entry) => entry as Record<string, unknown>)
    .filter((entry) => typeof entry?.start === 'string' && typeof entry?.end === 'string')
    .map((entry) => ({
      after: Number(entry.after ?? 0),
      start: String(entry.start),
      end: String(entry.end),
      minutes: Number(entry.minutes ?? 0),
    }));

  const subjects: Record<string, string> = {};
  for (const [subject, color] of Object.entries(
    (data.subjects as Record<string, unknown>) ?? {},
  )) {
    if (typeof color === 'string') {
      subjects[subject] = color;
    }
  }

  return { periods, breaks, subjects };
}

/** Parse the `timetable` attribute of a member sensor. */
export function parseWeek(raw: unknown): TimetableWeek {
  const week: TimetableWeek = {};
  if (!raw || typeof raw !== 'object') {
    return week;
  }
  for (const [key, value] of Object.entries(raw as Record<string, unknown>)) {
    const weekday = Number(key);
    if (!Number.isInteger(weekday) || weekday < 0 || weekday > 6 || !Array.isArray(value)) {
      continue;
    }
    const lessons = value
      .map((entry) => entry as Record<string, unknown>)
      .filter((entry) => Boolean(entry) && typeof entry.subject === 'string')
      .map((entry) => ({
        period: Number(entry.period ?? 0),
        subject: String(entry.subject),
        room: typeof entry.room === 'string' && entry.room ? entry.room : null,
      }))
      .sort((a, b) => a.period - b.period);
    if (lessons.length) {
      week[weekday] = lessons;
    }
  }
  return week;
}

/** The week of the member whose sensor this is. */
export function weekOf(entity: HassEntity | undefined): TimetableWeek {
  return parseWeek(entity?.attributes?.timetable);
}

/** Parse the `outlook` attribute of a member sensor. */
export function parseOutlook(raw: unknown): Outlook {
  if (!Array.isArray(raw)) {
    return [];
  }
  return raw
    .map((entry) => entry as Record<string, unknown>)
    .filter((entry) => Boolean(entry) && typeof entry.date === 'string')
    .map((entry) => ({
      date: String(entry.date),
      weekday: Number(entry.weekday ?? 0),
      mode: (entry.mode === 'care' || entry.mode === 'free' ? entry.mode : 'school') as DayMode,
      label: typeof entry.label === 'string' && entry.label ? entry.label : null,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

/** What the outlook holds for the member whose sensor this is. */
export function outlookOf(entity: HassEntity | undefined): Outlook {
  return parseOutlook(entity?.attributes?.outlook);
}

/** Today as `YYYY-MM-DD` in the browser's zone, which is how the outlook is keyed. */
export function todayKey(now: Date = new Date()): string {
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}

/**
 * Which dated day a weekday column stands for.
 *
 * With `roll`, the next one it can still mean — today or later, so a Tuesday that has
 * been points at next Tuesday. Without, the one in the week as it stands, which is
 * simply the first the window holds: the window starts on Monday.
 */
export function dayFor(outlook: Outlook, weekday: number, roll: boolean): OutlookDay | undefined {
  const matching = outlook.filter((day) => day.weekday === weekday);
  if (!roll) {
    return matching[0];
  }
  const today = todayKey();
  return matching.find((day) => day.date >= today) ?? matching[matching.length - 1];
}

/**
 * The date a weekday column stands for, as a `Date` in the browser's zone.
 *
 * Built from the parts rather than `new Date(iso)`, which would read the string as
 * UTC and land on the day before for anyone east of Greenwich.
 */
export function outlookDate(day: OutlookDay | undefined): Date | null {
  if (!day) {
    return null;
  }
  const [year, month, dayOfMonth] = day.date.split('-').map(Number);
  if (!year || !month || !dayOfMonth) {
    return null;
  }
  return new Date(year, month - 1, dayOfMonth);
}

/** True when a week holds at least one lesson. */
export function hasLessons(week: TimetableWeek): boolean {
  return Object.values(week).some((day) => day.length > 0);
}

/**
 * Interleave the periods with the breaks that fall between them.
 *
 * A break is only drawn when both of its neighbours are on screen, so hiding an
 * empty first period does not leave its break behind.
 */
export function buildRows(
  grid: TimetableGrid,
  visible: (period: TimetablePeriod) => boolean,
): TimetableRow[] {
  const shown = grid.periods.filter(visible);
  const indices = new Set(shown.map((period) => period.index));
  const rows: TimetableRow[] = [];

  for (const period of shown) {
    rows.push({ kind: 'period', period });
    const gap = grid.breaks.find(
      (item) => item.after === period.index && indices.has(period.index + 1),
    );
    if (gap) {
      rows.push({ kind: 'break', gap });
    }
  }
  return rows;
}

/** The lesson of a day, by period index. */
export function lessonAt(
  week: TimetableWeek,
  weekday: number,
  period: number,
): TimetableLesson | undefined {
  return (week[weekday] ?? []).find((lesson) => lesson.period === period);
}

/** How far into the current period we are, 0…1, or null when none is running. */
export function periodProgress(
  period: TimetablePeriod,
  minutes: number = nowMinutes(),
): number | null {
  if (minutes < period.startMinutes || minutes >= period.endMinutes) {
    return null;
  }
  const span = period.endMinutes - period.startMinutes;
  return span > 0 ? (minutes - period.startMinutes) / span : 0;
}

/** The period running right now, if any. */
export function currentPeriod(
  grid: TimetableGrid,
  minutes: number = nowMinutes(),
): TimetablePeriod | undefined {
  return grid.periods.find(
    (period) => minutes >= period.startMinutes && minutes < period.endMinutes,
  );
}

/** The next lesson of a day after a point in time, ignoring free periods. */
export function nextLesson(
  grid: TimetableGrid,
  week: TimetableWeek,
  weekday: number,
  minutes: number = nowMinutes(),
): { lesson: TimetableLesson; period: TimetablePeriod } | null {
  for (const period of grid.periods) {
    if (period.startMinutes <= minutes) {
      continue;
    }
    const lesson = lessonAt(week, weekday, period.index);
    if (lesson) {
      return { lesson, period };
    }
  }
  return null;
}
