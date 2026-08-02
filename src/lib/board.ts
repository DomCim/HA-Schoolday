/**
 * Reading the Schoolday configuration out of the board sensor.
 *
 * Every card reads the same sensor rather than carrying its own copy of the family
 * setup, so changing a colour in the options flow updates the whole dashboard at once.
 */
import { DEFAULT_MEMBER_COLORS } from './const';
import { parseGrid, type TimetableGrid } from './timetable';
import type { HassEntity, HomeAssistant } from './types';

export interface SchooldayMember {
  id: string;
  name: string;
  color: string;
  avatar: string | null;
  order: number;
}

export interface SchooldayBoard {
  entityId: string;
  members: SchooldayMember[];
  /** The lesson grid, or null when no timetable is configured. */
  timetable: TimetableGrid | null;
  /** False while a holiday calendar says the school is shut. */
  schoolToday: boolean;
  /** The event closing the school, when there is one. */
  noSchoolReason: string | null;
}

function isBoardEntity(entity: HassEntity): boolean {
  return entity.attributes?.schoolday_board === true;
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
): SchooldayBoard | null {
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

  const members: SchooldayMember[] = rawMembers.map((raw, index) => {
    const member = raw as Partial<SchooldayMember>;
    return {
      id: String(member.id ?? index),
      name: String(member.name ?? ''),
      color:
        member.color || DEFAULT_MEMBER_COLORS[index % DEFAULT_MEMBER_COLORS.length],
      avatar: member.avatar ?? null,
      order: member.order ?? index,
    };
  });
  members.sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));

  return {
    entityId: entity.entity_id,
    members,
    timetable: parseGrid(attributes.timetable),
    // Absent on an older integration, where every day was a school day.
    schoolToday: attributes.school_today !== false,
    noSchoolReason:
      typeof attributes.no_school_reason === 'string' ? attributes.no_school_reason : null,
  };
}

/**
 * The per-member sensor Schoolday publishes, located by its `member_id` attribute so
 * renaming the entity does not break the lookup.
 */
/**
 * The picture to draw for a member.
 *
 * An avatar is stored as free text, and a `person.` entity is the useful thing to put
 * there: Home Assistant already knows what that person looks like, and resolving it
 * here rather than copying the URL once means the picture follows whatever they change
 * it to. Anything else is taken as a URL and used as it stands.
 */
export function avatarUrl(hass: HomeAssistant, avatar: string | null): string | null {
  if (!avatar) {
    return null;
  }
  if (!avatar.includes('.') || avatar.includes('/') || avatar.includes(':')) {
    return avatar;
  }
  const entity = hass.states[avatar];
  if (!entity) {
    return avatar;
  }
  const picture = entity.attributes?.entity_picture;
  return typeof picture === 'string' && picture ? picture : null;
}

export function memberSensor(hass: HomeAssistant, memberId: string): HassEntity | undefined {
  return Object.values(hass.states).find(
    (entity) => entity.attributes?.member_id === memberId,
  );
}
