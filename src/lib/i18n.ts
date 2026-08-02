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
  'timetable.no_school': 'No school',
  'timetable.free': 'Holiday',
  'timetable.care': 'Holiday care',
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
  'editor.roll_days': 'Roll past weekdays on to next week',
  'editor.section': 'Section to open on',
  // admin
  'admin.tab_timetable': 'Timetable',
  'admin.tab_routines': 'Routines',
  'admin.tab_family': 'Family',
  'admin.tab_subjects': 'Subjects',
  'admin.tab_holidays': 'Days off',
  'admin.save': 'Save',
  'admin.add': 'Add',
  'admin.clear': 'Clear',
  'admin.remove': 'Remove',
  'admin.remove_confirm': 'Remove {name}? Their timetable and routines go too.',
  'admin.add_member': 'Add a family member',
  'admin.periods': 'Lesson times, one per line',
  'admin.periods_first': 'Set the lesson times first — the week hangs on them.',
  'admin.no_members': 'Nobody is set up yet. Add a family member first.',
  'admin.no_subjects': 'No subjects yet. They appear once a timetable has lessons in it.',
  'admin.subject': 'Subject',
  'admin.room': 'Room',
  'admin.name': 'Name',
  'admin.color': 'Colour',
  'admin.calendar': 'Own calendar',
  'admin.avatar': 'Avatar URL',
  'admin.block_morning': 'Morning',
  'admin.block_evening': 'Evening',
  'admin.day_free': 'Day off',
  'admin.day_care': 'Holiday care',
  'admin.steps_hint': 'One step per line',
  'admin.school_calendars': 'Calendars that close the school, one per line',
  'admin.care_keywords': 'Holiday-care keywords, one per line',
  'admin.care_hint': 'Holiday care',
  'admin.colors_hint':
    'Every subject already has a colour taken from its name. This is only for correcting one.',
  'admin.calendars_hint':
    'Any event running on these calendars means there is no school, so use calendars that hold nothing else.',
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
  'timetable.no_school': 'Schulfrei',
  'timetable.free': 'Ferien',
  'timetable.care': 'Ferienbetreuung',
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
  'editor.roll_days': 'Vergangene Wochentage auf nächste Woche weiterrollen',
  'editor.section': 'Bereich beim Öffnen',
  // admin
  'admin.tab_timetable': 'Stundenplan',
  'admin.tab_routines': 'Routinen',
  'admin.tab_family': 'Familie',
  'admin.tab_subjects': 'Fächer',
  'admin.tab_holidays': 'Freie Tage',
  'admin.save': 'Speichern',
  'admin.add': 'Hinzufügen',
  'admin.clear': 'Leeren',
  'admin.remove': 'Entfernen',
  'admin.remove_confirm': '{name} entfernen? Stundenplan und Routinen gehen mit.',
  'admin.add_member': 'Familienmitglied hinzufügen',
  'admin.periods': 'Stundenzeiten, eine pro Zeile',
  'admin.periods_first': 'Trage zuerst die Stundenzeiten ein — die Woche hängt daran.',
  'admin.no_members': 'Noch ist niemand angelegt. Lege zuerst ein Familienmitglied an.',
  'admin.no_subjects': 'Noch keine Fächer. Sie erscheinen, sobald ein Stundenplan Stunden hat.',
  'admin.subject': 'Fach',
  'admin.room': 'Raum',
  'admin.name': 'Name',
  'admin.color': 'Farbe',
  'admin.calendar': 'Eigener Kalender',
  'admin.avatar': 'Avatar-URL',
  'admin.block_morning': 'Morgens',
  'admin.block_evening': 'Abends',
  'admin.day_free': 'Freier Tag',
  'admin.day_care': 'Ferienbetreuung',
  'admin.steps_hint': 'Ein Schritt pro Zeile',
  'admin.school_calendars': 'Kalender, die die Schule schließen, einer pro Zeile',
  'admin.care_keywords': 'Betreuungs-Stichwörter, eines pro Zeile',
  'admin.care_hint': 'Ferienbetreuung',
  'admin.colors_hint':
    'Jedes Fach hat schon eine Farbe, abgeleitet aus seinem Namen. Das hier ist nur zum Korrigieren.',
  'admin.calendars_hint':
    'Jeder laufende Termin in diesen Kalendern bedeutet schulfrei — nimm also Kalender, in denen nichts anderes steht.',
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
