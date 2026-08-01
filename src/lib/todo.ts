/**
 * Reading and updating to-do lists.
 *
 * `todo.get_items` returns its result through the action response rather than entity
 * state, so the cards call it directly instead of going through the integration.
 */
import type { HassTodoItem, HomeAssistant } from './types';

export interface TodoList {
  entityId: string;
  name: string;
  icon: string | null;
  items: HassTodoItem[];
  /** False when the list rejected the request, e.g. an offline Bring! account. */
  ok: boolean;
}

interface GetItemsResponse {
  response?: Record<string, { items?: HassTodoItem[] }>;
}

export function listName(hass: HomeAssistant, entityId: string): string {
  const entity = hass.states[entityId];
  return (entity?.attributes?.friendly_name as string) || entityId;
}

function listIcon(hass: HomeAssistant, entityId: string): string | null {
  return (hass.states[entityId]?.attributes?.icon as string) || null;
}

/**
 * Fetch open items for several lists.
 *
 * A list that errors comes back with `ok: false` rather than failing the whole card —
 * Bring! in particular goes away whenever its cloud does.
 */
export async function fetchLists(
  hass: HomeAssistant,
  entityIds: string[],
  includeCompleted = false,
): Promise<TodoList[]> {
  const status = includeCompleted ? ['needs_action', 'completed'] : ['needs_action'];

  return Promise.all(
    entityIds.map(async (entityId): Promise<TodoList> => {
      const base = {
        entityId,
        name: listName(hass, entityId),
        icon: listIcon(hass, entityId),
      };
      try {
        const result = (await hass.callService(
          'todo',
          'get_items',
          { status },
          { entity_id: entityId },
          false,
          true,
        )) as GetItemsResponse;
        return { ...base, items: result?.response?.[entityId]?.items ?? [], ok: true };
      } catch (err) {
        console.warn(`[hearth] could not read ${entityId}`, err);
        return { ...base, items: [], ok: false };
      }
    }),
  );
}

/** Tick an item off, or put it back. */
export async function setItemStatus(
  hass: HomeAssistant,
  entityId: string,
  item: HassTodoItem,
  completed: boolean,
): Promise<void> {
  await hass.callService(
    'todo',
    'update_item',
    {
      // `uid` is not supported by every backend; the summary always is.
      item: item.uid || item.summary,
      status: completed ? 'completed' : 'needs_action',
    },
    { entity_id: entityId },
  );
}

/** Add an item to a list. */
export async function addItem(
  hass: HomeAssistant,
  entityId: string,
  summary: string,
): Promise<void> {
  await hass.callService('todo', 'add_item', { item: summary }, { entity_id: entityId });
}
