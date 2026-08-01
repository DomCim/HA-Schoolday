/**
 * Reading the Hearth configuration out of the board sensor.
 *
 * Every card reads the same sensor rather than carrying its own copy of the family
 * setup, so changing a colour in the options flow updates the whole dashboard at once.
 */
import { DEFAULT_MEMBER_COLORS } from './const';
import type { CalendarStyle } from './calendar';
import type { HassEntity, HomeAssistant } from './types';

export interface HearthMember {
  id: string;
  name: string;
  color: string;
  avatar: string | null;
  person: string | null;
  calendars: string[];
  todo_lists: string[];
  order: number;
}

export interface HearthBoard {
  entityId: string;
  members: HearthMember[];
  sharedCalendars: string[];
  sharedTodoLists: string[];
  readonlyCalendars: string[];
}

/** Colour used for events on calendars that belong to the family rather than a person. */
export const SHARED_COLOR = '#7a8b99';

function isBoardEntity(entity: HassEntity): boolean {
  return entity.attributes?.hearth_board === true;
}

/**
 * Locate the board sensor.
 *
 * Falls back to scanning for the marker attribute so renaming the entity does not
 * break every card on the dashboard.
 */
export function findBoard(
  hass: HomeAssistant,
  explicitEntityId?: string,
): HearthBoard | null {
  let entity: HassEntity | undefined;

  if (explicitEntityId) {
    entity = hass.states[explicitEntityId];
    if (!entity) {
      return null;
    }
  } else {
    entity = Object.values(hass.states).find(isBoardEntity);
    if (!entity) {
      return null;
    }
  }

  const attributes = entity.attributes as Record<string, unknown>;
  const rawMembers = Array.isArray(attributes.members) ? attributes.members : [];

  const members: HearthMember[] = rawMembers.map((raw, index) => {
    const member = raw as Partial<HearthMember>;
    return {
      id: String(member.id ?? index),
      name: String(member.name ?? ''),
      color:
        member.color || DEFAULT_MEMBER_COLORS[index % DEFAULT_MEMBER_COLORS.length],
      avatar: member.avatar ?? null,
      person: member.person ?? null,
      calendars: member.calendars ?? [],
      todo_lists: member.todo_lists ?? [],
      order: member.order ?? index,
    };
  });
  members.sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));

  const list = (key: string): string[] =>
    Array.isArray(attributes[key]) ? (attributes[key] as string[]) : [];

  return {
    entityId: entity.entity_id,
    members,
    sharedCalendars: list('shared_calendars'),
    sharedTodoLists: list('shared_todo_lists'),
    readonlyCalendars: list('readonly_calendars'),
  };
}

/**
 * Build the calendar-entity → {member, colour} map the calendar card renders from.
 *
 * A calendar assigned to a member wins over the shared list, so putting the family
 * calendar on one person by accident does not silently recolour everything.
 */
export function calendarStyles(
  board: HearthBoard,
  memberFilter?: Set<string>,
): Record<string, CalendarStyle> {
  const styles: Record<string, CalendarStyle> = {};

  for (const entityId of [...board.sharedCalendars, ...board.readonlyCalendars]) {
    styles[entityId] = { memberId: null, color: SHARED_COLOR };
  }
  for (const member of board.members) {
    if (memberFilter && !memberFilter.has(member.id)) {
      continue;
    }
    for (const entityId of member.calendars) {
      styles[entityId] = { memberId: member.id, color: member.color };
    }
  }
  return styles;
}

/** Calendars Hearth is allowed to create events on. */
export function writableCalendars(board: HearthBoard): string[] {
  const readonly = new Set(board.readonlyCalendars);
  const all = [
    ...board.sharedCalendars,
    ...board.members.flatMap((member) => member.calendars),
  ];
  return [...new Set(all)].filter((entityId) => !readonly.has(entityId));
}

/** Friendly name for a calendar entity, falling back to the entity id. */
export function calendarName(hass: HomeAssistant, entityId: string): string {
  const entity = hass.states[entityId];
  return (entity?.attributes?.friendly_name as string) || entityId;
}
