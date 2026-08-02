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
