/**
 * Reading the editable Schoolday configuration, and writing it back.
 *
 * The display cards read the small shapes the board and member sensors publish for
 * them. Editing needs more than that — every day of a routine rather than today's,
 * the calendar behind a member, the words that mean holiday care — so the board sensor
 * carries it all under one `admin` attribute that only the management card reads.
 *
 * Writing goes through Schoolday's services, because a card cannot edit a config
 * entry. The service is where the rules live; nothing here second-guesses them.
 */
import type { HassEntity, HomeAssistant } from './types';

export interface AdminMember {
  id: string;
  name: string;
  color: string;
  avatar: string | null;
  order: number;
  /** This member's own calendar, searched for the holiday-care keywords. */
  calendar: string | null;
  /** Which named set of lesson times their school rings to; null is the household's. */
  schedule: string | null;
}

/** Routine day keys: "0".."6", plus "free" for a day off and "care" for holiday care. */
export type RoutineDay = string;

export interface AdminConfig {
  members: AdminMember[];
  /** member id -> block -> day -> steps */
  routines: Record<string, Record<string, Record<RoutineDay, string[]>>>;
  /** `HH:MM-HH:MM`, one per period, in order. The times a member gets by default. */
  periods: string[];
  /** Another school's times, by name, for a household whose children are at two. */
  schedules: Record<string, string[]>;
  /** Only the subjects somebody recoloured; the rest derive theirs from the name. */
  colors: Record<string, string>;
  schoolCalendars: string[];
  careKeywords: string[];
  /** subject -> what it needs brought along. Household-wide, like the colours. */
  materials: Record<string, string[]>;
  /** Every subject in use, so the materials editor has something to list. */
  subjects: string[];
  /** member id -> "YYYY-MM-DD" -> what that date does differently. */
  exceptions: Record<string, Record<string, AdminException>>;
  /** How many weeks the timetable takes to repeat: 1, or 2 for an A/B school. */
  cycleWeeks: number;
  /** The Monday of a week that is week A, as `YYYY-MM-DD`. */
  cycleAnchor: string | null;
  /** Which week the household is in right now: 0 for A, 1 for B. */
  cycleNow: number;
}

export interface AdminException {
  /** Set means the whole day is taken over; there is no separate flag for that. */
  label: string | null;
  /** period -> the replacement, or null for a period that is cancelled. */
  periods: Record<string, { subject: string; room: string | null } | null>;
}

const EMPTY: AdminConfig = {
  members: [],
  routines: {},
  periods: [],
  schedules: {},
  colors: {},
  schoolCalendars: [],
  careKeywords: [],
  materials: {},
  subjects: [],
  exceptions: {},
  cycleWeeks: 1,
  cycleAnchor: null,
  cycleNow: 0,
};

function stringList(raw: unknown): string[] {
  return Array.isArray(raw) ? raw.filter((item): item is string => typeof item === 'string') : [];
}

/** Parse the board sensor's `admin` attribute. */
export function parseAdmin(raw: unknown): AdminConfig {
  if (!raw || typeof raw !== 'object') {
    return EMPTY;
  }
  const data = raw as Record<string, unknown>;

  const members: AdminMember[] = (Array.isArray(data.members) ? data.members : [])
    .map((entry) => entry as Record<string, unknown>)
    .filter((entry) => typeof entry?.id === 'string' && typeof entry?.name === 'string')
    .map((entry) => ({
      id: String(entry.id),
      name: String(entry.name),
      color: typeof entry.color === 'string' ? entry.color : '#3a86c8',
      avatar: typeof entry.avatar === 'string' && entry.avatar ? entry.avatar : null,
      order: Number(entry.order ?? 0),
      calendar: typeof entry.calendar === 'string' && entry.calendar ? entry.calendar : null,
      schedule: typeof entry.schedule === 'string' && entry.schedule ? entry.schedule : null,
    }))
    .sort((a, b) => a.order - b.order);

  const routines: AdminConfig['routines'] = {};
  for (const [memberId, blocks] of Object.entries(
    (data.routines as Record<string, unknown>) ?? {},
  )) {
    const perBlock: Record<string, Record<string, string[]>> = {};
    for (const [block, days] of Object.entries((blocks as Record<string, unknown>) ?? {})) {
      const perDay: Record<string, string[]> = {};
      for (const [day, steps] of Object.entries((days as Record<string, unknown>) ?? {})) {
        const cleaned = stringList(steps);
        if (cleaned.length) {
          perDay[day] = cleaned;
        }
      }
      perBlock[block] = perDay;
    }
    routines[memberId] = perBlock;
  }

  const colors: Record<string, string> = {};
  for (const [subject, value] of Object.entries((data.colors as Record<string, unknown>) ?? {})) {
    if (typeof value === 'string') {
      colors[subject] = value;
    }
  }

  const materials: Record<string, string[]> = {};
  for (const [subject, items] of Object.entries(
    (data.materials as Record<string, unknown>) ?? {},
  )) {
    const cleaned = stringList(items);
    if (cleaned.length) {
      materials[subject] = cleaned;
    }
  }

  const exceptions: AdminConfig['exceptions'] = {};
  for (const [memberId, dates] of Object.entries(
    (data.exceptions as Record<string, unknown>) ?? {},
  )) {
    const perDate: Record<string, AdminException> = {};
    for (const [day, entry] of Object.entries((dates as Record<string, unknown>) ?? {})) {
      const raw = (entry ?? {}) as Record<string, unknown>;
      const periods: AdminException['periods'] = {};
      for (const [key, value] of Object.entries(
        (raw.periods as Record<string, unknown>) ?? {},
      )) {
        const lesson = (value ?? {}) as Record<string, unknown>;
        periods[key] =
          typeof lesson.subject === 'string' && lesson.subject
            ? {
                subject: lesson.subject,
                room: typeof lesson.room === 'string' && lesson.room ? lesson.room : null,
              }
            : null;
      }
      perDate[day] = {
        label: typeof raw.label === 'string' && raw.label ? raw.label : null,
        periods,
      };
    }
    if (Object.keys(perDate).length) {
      exceptions[memberId] = perDate;
    }
  }

  return {
    members,
    routines,
    exceptions,
    periods: stringList(data.periods),
    schedules: Object.fromEntries(
      Object.entries((data.schedules as Record<string, unknown>) ?? {}).map(
        ([name, lines]) => [name, stringList(lines)],
      ),
    ),
    colors,
    schoolCalendars: stringList(data.school_calendars),
    careKeywords: stringList(data.care_keywords),
    materials,
    subjects: stringList(data.subjects),
    cycleWeeks: Number(data.cycle_weeks ?? 1) === 2 ? 2 : 1,
    cycleAnchor: typeof data.cycle_anchor === 'string' ? data.cycle_anchor : null,
    cycleNow: Number(data.cycle_now ?? 0) === 1 ? 1 : 0,
  };
}

/**
 * The ISO calendar week a `YYYY-MM-DD` falls in, and its ISO year.
 *
 * The two travel together on purpose: the ISO year is not always the calendar year at
 * the turn of December, and "week 1" of the wrong year is a fortnight out.
 */
export function isoWeek(date: string): { week: number; year: number } | null {
  const [y, m, d] = date.split('-').map(Number);
  if (!y || !m || !d) {
    return null;
  }
  // Thursday decides the ISO year — that is the whole rule.
  const thursday = new Date(Date.UTC(y, m - 1, d));
  thursday.setUTCDate(thursday.getUTCDate() + 3 - ((thursday.getUTCDay() + 6) % 7));
  const firstThursday = new Date(Date.UTC(thursday.getUTCFullYear(), 0, 4));
  firstThursday.setUTCDate(
    firstThursday.getUTCDate() + 3 - ((firstThursday.getUTCDay() + 6) % 7),
  );
  const week =
    1 + Math.round((thursday.getTime() - firstThursday.getTime()) / (7 * 86400000));
  return { week, year: thursday.getUTCFullYear() };
}

/**
 * What a subject needs brought along.
 *
 * Case-insensitively, matching the integration: the materials are typed somewhere
 * other than the timetable and should not have to agree keystroke for keystroke.
 */
export function materialsFor(config: AdminConfig, subject: string): string[] {
  const wanted = subject.toLowerCase();
  const found = Object.entries(config.materials).find(
    ([name]) => name.toLowerCase() === wanted,
  );
  return found ? found[1] : [];
}

/** The editable configuration, off the board sensor. */
export function adminOf(entity: HassEntity | undefined): AdminConfig {
  return parseAdmin(entity?.attributes?.admin);
}

/** One member's steps for one block on one day. */
export function stepsFor(
  config: AdminConfig,
  memberId: string,
  block: string,
  day: RoutineDay,
): string[] {
  return config.routines[memberId]?.[block]?.[day] ?? [];
}

/** Every calendar entity in this Home Assistant, for the pickers. */
export function calendarEntities(hass: HomeAssistant): string[] {
  return Object.keys(hass.states)
    .filter((entityId) => entityId.startsWith('calendar.'))
    .sort();
}

/**
 * Every person entity, for the avatar picker.
 *
 * Home Assistant already knows what the household looks like; asking for a URL when
 * the picture is right there is asking the wrong question.
 */
export function personEntities(hass: HomeAssistant): string[] {
  return Object.keys(hass.states)
    .filter((entityId) => entityId.startsWith('person.'))
    .sort();
}

/**
 * The readable part of whatever a failed service call threw.
 *
 * Home Assistant rejects with a plain object, not an Error, so `String(err)` gives
 * "[object Object]" — which is the one thing an error message must never be. The
 * message a refused value carries is the whole point of showing it.
 */
export function messageOf(err: unknown): string {
  if (typeof err === 'string') {
    return err;
  }
  if (err && typeof err === 'object') {
    const record = err as Record<string, unknown>;
    for (const key of ['message', 'error']) {
      const value = record[key];
      if (typeof value === 'string' && value) {
        return value;
      }
    }
    const body = record.body as Record<string, unknown> | undefined;
    if (body && typeof body.message === 'string' && body.message) {
      return body.message;
    }
    try {
      return JSON.stringify(err);
    } catch {
      return 'Unknown error';
    }
  }
  return String(err);
}

/**
 * Call one of Schoolday's services.
 *
 * Errors are left to bubble: Home Assistant already shows a service failure, and the
 * message a refused value carries is the one worth reading.
 */
export function callSchoolday(
  hass: HomeAssistant,
  service: string,
  data: Record<string, unknown>,
): Promise<unknown> {
  return hass.callService('schoolday', service, data);
}
