/**
 * Minimal Home Assistant frontend typings.
 *
 * Deliberately hand-rolled instead of depending on `custom-card-helpers`: we need a
 * handful of members, and the package drags in a stale copy of
 * `home-assistant-js-websocket` that bloats the bundle.
 */

export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: Record<string, unknown>;
  last_changed: string;
  last_updated: string;
}

export interface HassUser {
  id: string;
  name: string;
  is_admin: boolean;
}

export interface HassLocale {
  language: string;
  number_format: string;
  time_format: string;
  /** "language" | "monday" | ... "sunday" */
  first_weekday: string;
}

export interface HomeAssistant {
  states: Record<string, HassEntity>;
  config: { time_zone: string; country?: string | null };
  themes: { darkMode: boolean };
  language: string;
  locale: HassLocale;
  user?: HassUser;

  callApi<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    path: string,
    parameters?: Record<string, unknown>,
  ): Promise<T>;

  callService(
    domain: string,
    service: string,
    serviceData?: Record<string, unknown>,
    target?: Record<string, unknown>,
    notifyOnError?: boolean,
    returnResponse?: boolean,
  ): Promise<{ response?: unknown }>;

  callWS<T>(msg: Record<string, unknown>): Promise<T>;

  formatEntityState(stateObj: HassEntity, state?: string): string;
}

export interface LovelaceCardConfig {
  type: string;
  [key: string]: unknown;
}

export interface LovelaceCard extends HTMLElement {
  hass?: HomeAssistant;
  isPanel?: boolean;
  editMode?: boolean;
  setConfig(config: LovelaceCardConfig): void;
  getCardSize(): number | Promise<number>;
  getGridOptions?(): { columns?: number | 'full'; rows?: number | 'auto'; min_columns?: number };
}

export interface LovelaceCardEditor extends HTMLElement {
  hass?: HomeAssistant;
  setConfig(config: LovelaceCardConfig): void;
}

/** Entry registered in `window.customCards` so the card appears in the card picker. */
export interface CustomCardEntry {
  type: string;
  name: string;
  description: string;
  preview?: boolean;
  documentationURL?: string;
}

declare global {
  interface Window {
    customCards?: CustomCardEntry[];
  }
}

/**
 * A calendar event as returned by `GET /api/calendars/<entity_id>?start=&end=`.
 *
 * `start`/`end` carry either `dateTime` (timed event, ISO 8601 with offset) or
 * `date` (all-day event, `YYYY-MM-DD`) — never both.
 */
export interface CalendarDateTime {
  dateTime?: string;
  date?: string;
}

export interface HassCalendarEvent {
  summary: string;
  start: CalendarDateTime;
  end: CalendarDateTime;
  description?: string | null;
  location?: string | null;
  uid?: string | null;
  recurrence_id?: string | null;
  rrule?: string | null;
}

/** An item of a `todo.*` entity, as returned by the `todo.get_items` action. */
export interface HassTodoItem {
  uid: string;
  summary: string;
  status: 'needs_action' | 'completed';
  description?: string | null;
  due?: string | null;
}
