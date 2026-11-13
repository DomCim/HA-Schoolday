/**
 * Locale helpers.
 *
 * Everything works in the browser's local time zone. On a wall tablet in the house
 * that is the same zone Home Assistant runs in, which keeps the arithmetic simple and
 * avoids shipping a date library.
 */
import type { HomeAssistant } from './types';

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

/** The names `set_cycle` takes for the first day of the week, Monday first. */
export const WEEKDAY_NAMES = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

/** The seven weekdays in order, starting on `first`. */
export function weekOrder(first: number): number[] {
  return Array.from({ length: 7 }, (_, offset) => (first + offset) % 7);
}

/** The household's first day of the week from sensor data, 0..6. The default is Monday. */
export function weekStartOf(raw: unknown): number {
  const value = Number(raw ?? 0);
  return Number.isInteger(value) && value >= 0 && value <= 6 ? value : 0;
}
