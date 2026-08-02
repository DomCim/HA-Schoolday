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
}

/** Routine day keys: "0".."6", plus "free" for a day off and "care" for holiday care. */
export type RoutineDay = string;

export interface AdminConfig {
  members: AdminMember[];
  /** member id -> block -> day -> steps */
  routines: Record<string, Record<string, Record<RoutineDay, string[]>>>;
  /** `HH:MM-HH:MM`, one per period, in order. */
  periods: string[];
  /** Only the subjects somebody recoloured; the rest derive theirs from the name. */
  colors: Record<string, string>;
  schoolCalendars: string[];
  careKeywords: string[];
}

const EMPTY: AdminConfig = {
  members: [],
  routines: {},
  periods: [],
  colors: {},
  schoolCalendars: [],
  careKeywords: [],
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

  return {
    members,
    routines,
    periods: stringList(data.periods),
    colors,
    schoolCalendars: stringList(data.school_calendars),
    careKeywords: stringList(data.care_keywords),
  };
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
