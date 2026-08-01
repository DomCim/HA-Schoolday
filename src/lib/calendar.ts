/**
 * Reading and writing calendar events.
 *
 * Events are fetched straight from Home Assistant's REST API rather than through the
 * integration, so the cards stay responsive when paging through months and the server
 * keeps no per-view state.
 */
import { addDays, startOfDay, toDateKey, toDateTimeString } from './dates';
import type { HassCalendarEvent, HomeAssistant } from './types';

export interface HearthEvent {
  summary: string;
  start: Date;
  /** Exclusive. For all-day events this is midnight after the last day. */
  end: Date;
  allDay: boolean;
  calendar: string;
  memberId: string | null;
  color: string;
  description?: string | null;
  location?: string | null;
  uid?: string | null;
  recurrenceId?: string | null;
}

/** Maps a calendar entity to the member who owns it and the colour to paint it. */
export interface CalendarStyle {
  memberId: string | null;
  color: string;
}

function parseBoundary(value: { dateTime?: string; date?: string }): {
  date: Date;
  allDay: boolean;
} {
  if (value.date) {
    // All-day boundaries are plain calendar dates; build them in local time so they do
    // not slide across a day boundary in negative UTC offsets.
    return { date: startOfDay(new Date(`${value.date}T00:00:00`)), allDay: true };
  }
  return { date: new Date(value.dateTime as string), allDay: false };
}

function toHearthEvent(
  raw: HassCalendarEvent,
  calendar: string,
  style: CalendarStyle,
): HearthEvent | null {
  if (!raw?.start || !raw?.end) {
    return null;
  }
  const start = parseBoundary(raw.start);
  const end = parseBoundary(raw.end);
  if (Number.isNaN(start.date.getTime()) || Number.isNaN(end.date.getTime())) {
    return null;
  }
  return {
    summary: raw.summary || '',
    start: start.date,
    end: end.date,
    allDay: start.allDay,
    calendar,
    memberId: style.memberId,
    color: style.color,
    description: raw.description,
    location: raw.location,
    uid: raw.uid,
    recurrenceId: raw.recurrence_id,
  };
}

/**
 * Fetch events for a half-open [start, end) range.
 *
 * A calendar that errors (offline CalDAV server, revoked token) is skipped rather than
 * failing the whole view — one broken calendar should not blank the board.
 */
export async function fetchEvents(
  hass: HomeAssistant,
  styles: Record<string, CalendarStyle>,
  start: Date,
  end: Date,
): Promise<{ events: HearthEvent[]; failed: string[] }> {
  const params = `start=${encodeURIComponent(start.toISOString())}&end=${encodeURIComponent(
    end.toISOString(),
  )}`;

  const results = await Promise.all(
    Object.keys(styles).map(async (entityId) => {
      try {
        const raw = await hass.callApi<HassCalendarEvent[]>(
          'GET',
          `calendars/${entityId}?${params}`,
        );
        return {
          entityId,
          events: (raw || [])
            .map((item) => toHearthEvent(item, entityId, styles[entityId]))
            .filter((item): item is HearthEvent => item !== null),
        };
      } catch (err) {
        console.warn(`[hearth] could not load ${entityId}`, err);
        return { entityId, events: null };
      }
    }),
  );

  const events: HearthEvent[] = [];
  const failed: string[] = [];
  for (const result of results) {
    if (result.events === null) {
      failed.push(result.entityId);
    } else {
      events.push(...result.events);
    }
  }

  events.sort((a, b) => {
    // All-day events first within a day, then chronologically.
    if (a.allDay !== b.allDay) {
      return a.allDay ? -1 : 1;
    }
    return a.start.getTime() - b.start.getTime();
  });
  return { events, failed };
}

/** True when the event covers any part of the given day. */
export function occursOn(event: HearthEvent, day: Date): boolean {
  const dayStart = startOfDay(day);
  const dayEnd = addDays(dayStart, 1);
  // End is exclusive, so an event ending exactly at midnight does not spill over.
  return event.start < dayEnd && event.end > dayStart;
}

/** The days in [start, end), as local midnights. */
export function daysBetween(start: Date, end: Date): Date[] {
  const days: Date[] = [];
  for (let day = startOfDay(start); day < end; day = addDays(day, 1)) {
    days.push(day);
  }
  return days;
}

/** Group events by local date key for the days in [start, end). */
export function groupByDay(
  events: HearthEvent[],
  days: Date[],
): Map<string, HearthEvent[]> {
  const bounds = days.map((day) => ({
    key: toDateKey(day),
    from: day.getTime(),
    to: addDays(day, 1).getTime(),
  }));
  const buckets = new Map<string, HearthEvent[]>(
    bounds.map((bound) => [bound.key, [] as HearthEvent[]]),
  );

  for (const event of events) {
    const from = event.start.getTime();
    const to = event.end.getTime();
    for (const bound of bounds) {
      // End is exclusive, so an event ending exactly at midnight does not spill over.
      if (from < bound.to && to > bound.from) {
        buckets.get(bound.key)!.push(event);
      }
    }
  }
  return buckets;
}

export interface NewEvent {
  summary: string;
  start: Date;
  end: Date;
  allDay: boolean;
  description?: string;
}

/** Create an event on a calendar entity. */
export async function createEvent(
  hass: HomeAssistant,
  entityId: string,
  event: NewEvent,
): Promise<void> {
  const data: Record<string, unknown> = { summary: event.summary };
  if (event.description) {
    data.description = event.description;
  }
  if (event.allDay) {
    data.start_date = toDateKey(event.start);
    // `end_date` is exclusive, so a single-day event ends on the following day.
    data.end_date = toDateKey(event.end);
  } else {
    data.start_date_time = toDateTimeString(event.start);
    data.end_date_time = toDateTimeString(event.end);
  }
  await hass.callService('calendar', 'create_event', data, { entity_id: entityId });
}
