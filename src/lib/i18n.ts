/**
 * Card translations.
 *
 * The cards follow Home Assistant's own language rather than a card option, so a
 * German household gets a German wall panel without configuring anything. English
 * is the fallback for every key.
 */
import type { HomeAssistant } from './types';

type Dict = Record<string, string>;

const EN: Dict = {
  // shared
  'board.missing': 'No Schoolday board found. Add the Schoolday integration.',

  // routines
  'routines.nothing_today': 'Nothing today',
  'routines.auto': 'Automatic (by time of day)',
  'routines.morning': 'Morning',
  'routines.evening': 'Evening',
  'routines.both': 'Both',
  'routines.none_configured':
    'No routines for today. Add them under Configure → Edit routines in the Schoolday integration.',

  // timetable
  'timetable.no_periods':
    'No lesson times yet. Add them under Configure → School timetable in the Schoolday integration.',
  'timetable.none_configured':
    'Nobody has a timetable yet. Add one under Configure → School timetable in the Schoolday integration.',
  'timetable.break': 'Break',
  'timetable.now': 'Now',
  'timetable.next': 'Next',
  'timetable.remaining': '{minutes} min left',
  'timetable.done_for_today': 'School is out for today.',
  'timetable.layout_auto': 'Automatic (week, one day when narrow)',
  'timetable.layout_week': 'Whole week',
  'timetable.layout_day': 'One day',
  'timetable.days_auto': 'Automatic (as the timetable needs)',
  'timetable.days_school': 'Monday to Friday',
  'timetable.days_week': 'All seven days',

  // card editors
  'editor.block': 'Which block to show',
  'editor.evening_from': 'Evening starts at (hour)',
  'editor.show_empty': 'Show members with nothing on today',
  'editor.members': 'Limit to these members',
  'editor.member': 'Family member',
  'editor.layout': 'Layout',
  'editor.week_days': 'Days shown',
  'editor.show_rooms': 'Show rooms',
  'editor.show_times': 'Show lesson times',
  'editor.show_breaks': 'Show breaks',
  'editor.hide_empty_periods': 'Hide periods nobody has',
  'editor.highlight': 'Mark today and the running lesson',
  'editor.weather_entity': 'Weather entity',
  'editor.greeting': 'Greeting',
  'editor.show_seconds': 'Show seconds',
};

const DE: Dict = {
  'board.missing': 'Kein Schoolday-Board gefunden. Füge die Schoolday-Integration hinzu.',

  'routines.nothing_today': 'Heute nichts',
  'routines.auto': 'Automatisch (nach Tageszeit)',
  'routines.morning': 'Morgen',
  'routines.evening': 'Abend',
  'routines.both': 'Beide',
  'routines.none_configured':
    'Für heute sind keine Routinen hinterlegt. Trage sie in der Schoolday-Integration unter „Konfigurieren → Routinen bearbeiten“ ein.',

  'timetable.no_periods':
    'Noch keine Stundenzeiten. Trage sie in der Schoolday-Integration unter „Konfigurieren → Stundenplan“ ein.',
  'timetable.none_configured':
    'Noch hat niemand einen Stundenplan. Lege ihn in der Schoolday-Integration unter „Konfigurieren → Stundenplan“ an.',
  'timetable.break': 'Pause',
  'timetable.now': 'Jetzt',
  'timetable.next': 'Danach',
  'timetable.remaining': 'noch {minutes} min',
  'timetable.done_for_today': 'Für heute ist Schule aus.',
  'timetable.layout_auto': 'Automatisch (Woche, schmal ein Tag)',
  'timetable.layout_week': 'Ganze Woche',
  'timetable.layout_day': 'Ein Tag',
  'timetable.days_auto': 'Automatisch (wie der Stundenplan es braucht)',
  'timetable.days_school': 'Montag bis Freitag',
  'timetable.days_week': 'Alle sieben Tage',

  'editor.block': 'Welcher Block angezeigt wird',
  'editor.evening_from': 'Abend beginnt um (Stunde)',
  'editor.show_empty': 'Mitglieder ohne Routine heute anzeigen',
  'editor.members': 'Auf diese Mitglieder beschränken',
  'editor.member': 'Familienmitglied',
  'editor.layout': 'Darstellung',
  'editor.week_days': 'Angezeigte Tage',
  'editor.show_rooms': 'Räume anzeigen',
  'editor.show_times': 'Stundenzeiten anzeigen',
  'editor.show_breaks': 'Pausen anzeigen',
  'editor.hide_empty_periods': 'Stunden ausblenden, die niemand hat',
  'editor.highlight': 'Heute und laufende Stunde hervorheben',
  'editor.weather_entity': 'Wetter-Entität',
  'editor.greeting': 'Begrüßung',
  'editor.show_seconds': 'Sekunden anzeigen',
};

const DICTS: Record<string, Dict> = { en: EN, de: DE };

/** Base language of the Home Assistant frontend, e.g. "de" from "de-DE". */
function language(hass?: HomeAssistant): string {
  const raw = hass?.locale?.language || hass?.language || 'en';
  return raw.toLowerCase().split('-')[0];
}

/**
 * Translate a key, falling back to English and then to the key itself.
 *
 * `{name}` placeholders are replaced from `vars`.
 */
export function t(
  hass: HomeAssistant | undefined,
  key: string,
  vars?: Record<string, string | number>,
): string {
  const dict = DICTS[language(hass)] ?? EN;
  let text = dict[key] ?? EN[key] ?? key;
  if (vars) {
    for (const [name, value] of Object.entries(vars)) {
      text = text.replace(`{${name}}`, String(value));
    }
  }
  return text;
}

/** Languages the cards ship strings for. */
export const SUPPORTED_LANGUAGES = Object.keys(DICTS);
