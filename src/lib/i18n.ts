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
  'routines.sick': 'At home ill',
  'routines.packed_for': 'for {subject}',
  'timetable.sick': 'Ill',
  'timetable.event': 'No normal lessons',
  'timetable.changed': 'Changed',

  // the routine record
  'stats.percent': '{value}%',
  'stats.window': 'over {days} days',
  'stats.window_one': 'over one day',
  'stats.streak': '{days} days in a row',
  'stats.best': 'best {days}',
  'stats.day_done': '{done} of {asked} done',
  'stats.nothing_asked': 'Nothing on',
  'stats.nothing_yet': 'Nothing on the record yet. It starts with the first school day.',
  'stats.none_configured':
    'No routines to keep a record of. Add them under Configure → Edit routines in the Schoolday integration.',
  'stats.sort_board': 'The usual family order',
  'stats.sort_rate': 'Best record first',

  // homework
  'homework.nothing': 'Nothing to do',
  'homework.all_done': 'No homework outstanding.',
  'homework.overdue': 'Overdue',
  'homework.today': 'Due today',
  'homework.tomorrow': 'Due tomorrow',
  'homework.later': 'Later',
  'homework.someday': 'No date',

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
  'editor.show_done': 'Show what is already done',
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
  'editor.days': 'Days shown',
  'editor.show_steps': 'Show the tally per step',
  'editor.sort': 'Order',
  // admin
  'admin.tab_timetable': 'Timetable',
  'admin.tab_routines': 'Routines',
  'admin.tab_family': 'Family',
  'admin.tab_subjects': 'Subjects',
  'admin.tab_holidays': 'Days off',
  'admin.tab_materials': 'Material',
  'admin.tab_exceptions': 'Exceptions',
  'admin.cycle_one': 'One week',
  'admin.cycle_two': 'Two weeks (A/B)',
  'admin.cycle_start': 'Week A starts in calendar week',
  'admin.cycle_now': 'This week is week {week}.',
  'admin.week_a': 'Week A',
  'admin.week_b': 'Week B',
  'admin.exceptions_hint':
    'What one date does differently. A label takes the whole day over; tap a period to cancel it or say what runs instead. Dates in the past are dropped by themselves.',
  'admin.exception_date': 'Date',
  'admin.exception_label': 'What the day is',
  'admin.exception_label_hint': 'School trip, sports day — leave empty for a normal day',
  'admin.exception_cancel': 'Cancelled',
  'admin.exception_reset': 'Back to the timetable',
  'admin.exception_none': 'Nothing is different on this date.',
  'admin.exception_add': 'Add a date',
  'admin.materials_hint': 'What each subject needs brought along. These show up in the evening routine on the day before, for whoever has that subject.',
  'admin.materials_items': 'One thing per line',
  'admin.save': 'Save',
  'admin.add': 'Add',
  'admin.clear': 'Clear',
  'admin.remove': 'Remove',
  'admin.remove_confirm': 'Remove {name}? Their timetable and routines go too.',
  'admin.add_member': 'Add a family member',
  'admin.periods': 'Lesson times, one per line',
  'admin.schedule': 'School',
  'admin.schedule_default': 'The usual times',
  'admin.schedule_name': 'Name of the school',
  'admin.schedule_hint': 'Grammar school, primary school…',
  'admin.schedule_add': 'Another school with different times',
  'admin.periods_first': 'Set the lesson times first — the week hangs on them.',
  'admin.no_members': 'Nobody is set up yet. Add a family member first.',
  'admin.no_subjects': 'No subjects yet. They appear once a timetable has lessons in it.',
  'admin.subject': 'Subject',
  'admin.room': 'Room',
  'admin.name': 'Name',
  'admin.color': 'Colour',
  'admin.calendar': 'Own calendar',
  'admin.avatar': 'Picture',
  'admin.block_morning': 'Morning',
  'admin.block_evening': 'Evening',
  'admin.day_free': 'Day off',
  'admin.day_care': 'Holiday care',
  'admin.steps_hint': 'One step per line',
  'admin.school_calendars': 'Calendars that close the school, one per line',
  'admin.care_keywords': 'Holiday-care keywords, one per line',
  'admin.care_hint': 'Holiday care',
  'admin.avatar_hint':
    'For a picture, put in a person entity — the one Home Assistant already has. A URL works too.',
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
  'routines.sick': 'Krank zu Hause',
  'routines.packed_for': 'für {subject}',
  'timetable.sick': 'Krank',
  'timetable.event': 'Kein regulärer Unterricht',
  'timetable.changed': 'Geändert',

  'stats.percent': '{value} %',
  'stats.window': 'über {days} Tage',
  'stats.window_one': 'über einen Tag',
  'stats.streak': '{days} Tage in Folge',
  'stats.best': 'beste {days}',
  'stats.day_done': '{done} von {asked} erledigt',
  'stats.nothing_asked': 'Nichts zu tun',
  'stats.nothing_yet': 'Noch nichts aufgezeichnet. Es beginnt mit dem ersten Schultag.',
  'stats.none_configured':
    'Es gibt keine Routinen, über die sich etwas sagen ließe. Trage sie in der Schoolday-Integration unter „Konfigurieren → Routinen bearbeiten“ ein.',
  'stats.sort_board': 'Die übliche Reihenfolge der Familie',
  'stats.sort_rate': 'Beste Bilanz zuerst',

  'homework.nothing': 'Nichts zu tun',
  'homework.all_done': 'Keine offenen Hausaufgaben.',
  'homework.overdue': 'Überfällig',
  'homework.today': 'Heute fällig',
  'homework.tomorrow': 'Morgen fällig',
  'homework.later': 'Später',
  'homework.someday': 'Ohne Datum',

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
  'editor.show_done': 'Bereits Erledigtes anzeigen',
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
  'editor.days': 'Angezeigte Tage',
  'editor.show_steps': 'Bilanz je Schritt anzeigen',
  'editor.sort': 'Reihenfolge',
  // admin
  'admin.tab_timetable': 'Stundenplan',
  'admin.tab_routines': 'Routinen',
  'admin.tab_family': 'Familie',
  'admin.tab_subjects': 'Fächer',
  'admin.tab_holidays': 'Freie Tage',
  'admin.tab_materials': 'Material',
  'admin.tab_exceptions': 'Ausnahmen',
  'admin.cycle_one': 'Eine Woche',
  'admin.cycle_two': 'Zwei Wochen (A/B)',
  'admin.cycle_start': 'A-Woche beginnt in KW',
  'admin.cycle_now': 'Diese Woche ist Woche {week}.',
  'admin.week_a': 'A-Woche',
  'admin.week_b': 'B-Woche',
  'admin.exceptions_hint':
    'Was ein einzelnes Datum anders macht. Eine Bezeichnung nimmt den ganzen Tag ein; auf eine Stunde tippen, um sie entfallen zu lassen oder zu sagen, was stattdessen läuft. Vergangene Daten fallen von selbst weg.',
  'admin.exception_date': 'Datum',
  'admin.exception_label': 'Was der Tag ist',
  'admin.exception_label_hint': 'Wandertag, Sportfest — leer lassen für einen normalen Tag',
  'admin.exception_cancel': 'Entfällt',
  'admin.exception_reset': 'Zurück zum Stundenplan',
  'admin.exception_none': 'An diesem Datum ist nichts anders.',
  'admin.exception_add': 'Datum hinzufügen',
  'admin.materials_hint': 'Was ein Fach an Sachen braucht. Es erscheint am Abend davor in der Abendroutine, bei jedem Kind, das dieses Fach hat.',
  'admin.materials_items': 'Eine Sache pro Zeile',
  'admin.save': 'Speichern',
  'admin.add': 'Hinzufügen',
  'admin.clear': 'Leeren',
  'admin.remove': 'Entfernen',
  'admin.remove_confirm': '{name} entfernen? Stundenplan und Routinen gehen mit.',
  'admin.add_member': 'Familienmitglied hinzufügen',
  'admin.periods': 'Stundenzeiten, eine pro Zeile',
  'admin.schedule': 'Schule',
  'admin.schedule_default': 'Die üblichen Zeiten',
  'admin.schedule_name': 'Name der Schule',
  'admin.schedule_hint': 'Gymnasium, Grundschule …',
  'admin.schedule_add': 'Weitere Schule mit anderen Zeiten',
  'admin.periods_first': 'Trage zuerst die Stundenzeiten ein — die Woche hängt daran.',
  'admin.no_members': 'Noch ist niemand angelegt. Lege zuerst ein Familienmitglied an.',
  'admin.no_subjects': 'Noch keine Fächer. Sie erscheinen, sobald ein Stundenplan Stunden hat.',
  'admin.subject': 'Fach',
  'admin.room': 'Raum',
  'admin.name': 'Name',
  'admin.color': 'Farbe',
  'admin.calendar': 'Eigener Kalender',
  'admin.avatar': 'Bild',
  'admin.block_morning': 'Morgens',
  'admin.block_evening': 'Abends',
  'admin.day_free': 'Freier Tag',
  'admin.day_care': 'Ferienbetreuung',
  'admin.steps_hint': 'Ein Schritt pro Zeile',
  'admin.school_calendars': 'Kalender, die die Schule schließen, einer pro Zeile',
  'admin.care_keywords': 'Betreuungs-Stichwörter, eines pro Zeile',
  'admin.care_hint': 'Ferienbetreuung',
  'admin.avatar_hint':
    'Für ein Bild eine Person-Entität eintragen — die, die Home Assistant schon kennt. Eine URL geht auch.',
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
