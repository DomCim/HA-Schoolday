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
  'board.missing': 'No Hearth board found. Add the Hearth integration.',
  'board.missing_hint':
    'No Hearth board found. Add the Hearth integration, or set board_entity in this card.',
  'board.no_members': "No family members yet. Add them in the Hearth integration's options.",

  // calendar
  'calendar.month': 'Month',
  'calendar.week': 'Week',
  'calendar.day': 'Day',
  'calendar.previous': 'Previous',
  'calendar.today': 'Today',
  'calendar.next': 'Next',
  'calendar.new_event': 'New event',
  'calendar.no_calendars':
    "No calendars are assigned yet. Open the Hearth integration's options and give your family members their calendars.",
  'calendar.load_failed': 'Could not load: {items}',
  'calendar.empty_day': 'Nothing planned.',
  'calendar.empty_day_tap': 'Nothing planned. Tap to add something.',

  // event dialog
  'dialog.title': 'New event',
  'dialog.summary': 'Title',
  'dialog.calendar': 'Calendar',
  'dialog.date': 'Date',
  'dialog.all_day': 'All day',
  'dialog.from': 'From',
  'dialog.to': 'To',
  'dialog.note': 'Note',
  'dialog.cancel': 'Cancel',
  'dialog.save': 'Save',
  'dialog.saving': 'Saving…',
  'dialog.no_writable':
    'No writable calendar is configured. Add calendars to a family member, or remove one from the read-only list.',
  'dialog.failed': 'The event could not be created.',

  // people
  'people.home': 'Home',
  'people.away': 'Out',

  // agenda
  'agenda.all_day': 'All day',
  'agenda.nothing_planned': 'Nothing planned',
  'agenda.nothing_coming': 'Nothing coming up.',

  // lists
  'lists.empty': 'Nothing on this list',
  'lists.unreachable': 'Not reachable right now',
  'lists.show_more': 'Show {count} more',
  'lists.add': 'Add',
  'lists.add_placeholder': 'Add an item',
  'lists.none_configured':
    'No lists configured. Pick your family lists in the Hearth options, or set entities on this card.',

  // routines
  'routines.nothing_today': 'Nothing today',
  'routines.auto': 'Automatic (by time of day)',
  'routines.morning': 'Morning',
  'routines.evening': 'Evening',
  'routines.both': 'Both',
  'routines.none_configured':
    'No routines for today. Add them under Configure → Edit routines in the Hearth integration.',

  // timetable
  'timetable.no_periods':
    'No lesson times yet. Add them under Configure → School timetable in the Hearth integration.',
  'timetable.none_configured':
    'Nobody has a timetable yet. Add one under Configure → School timetable in the Hearth integration.',
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
  'editor.board_entity': 'Board sensor',
  'editor.view': 'Opening view',
  'editor.views': 'Available views',
  'editor.show_legend': 'Show the colour legend',
  'editor.create': 'Allow creating events by tapping a day',
  'editor.default_calendar': 'Preselected calendar',
  'editor.max_events_per_day': 'Events per day before "+N"',
  'editor.days': 'Days ahead',
  'editor.max_events': 'Events per day',
  'editor.hide_empty_days': 'Hide days with nothing on them',
  'editor.show_events': "Show today's events",
  'editor.show_tasks': 'Show open task counts',
  'editor.show_points': 'Show points',
  'editor.entities': 'To-do lists',
  'editor.allow_add': 'Allow adding items',
  'editor.max_items': 'Items before collapsing',
  'editor.columns': 'Columns',
  'editor.weather_entity': 'Weather entity',
  'editor.greeting': 'Greeting',
  'editor.show_seconds': 'Show seconds',
  'editor.block': 'Which block to show',
  'editor.evening_from': 'Evening starts at (hour)',
  'editor.show_empty': 'Show members with nothing on today',
  'editor.members': 'Limit to these members',
  'editor.member': 'Family member',
  'editor.layout': 'Layout',
  'editor.week_days': 'Days shown',
  'editor.show_rooms': 'Show rooms',
  'editor.show_breaks': 'Show breaks',
  'editor.show_times': 'Show lesson times',
  'editor.hide_empty_periods': 'Hide periods nobody has',
  'editor.highlight': 'Mark today and the running lesson',
};

const DE: Dict = {
  'board.missing': 'Kein Hearth-Board gefunden. Füge die Hearth-Integration hinzu.',
  'board.missing_hint':
    'Kein Hearth-Board gefunden. Füge die Hearth-Integration hinzu oder setze board_entity in dieser Karte.',
  'board.no_members':
    'Noch keine Familienmitglieder. Lege sie in den Optionen der Hearth-Integration an.',

  'calendar.month': 'Monat',
  'calendar.week': 'Woche',
  'calendar.day': 'Tag',
  'calendar.previous': 'Zurück',
  'calendar.today': 'Heute',
  'calendar.next': 'Weiter',
  'calendar.new_event': 'Neuer Termin',
  'calendar.no_calendars':
    'Noch keine Kalender zugeordnet. Öffne die Optionen der Hearth-Integration und gib deinen Familienmitgliedern ihre Kalender.',
  'calendar.load_failed': 'Konnte nicht geladen werden: {items}',
  'calendar.empty_day': 'Nichts geplant.',
  'calendar.empty_day_tap': 'Nichts geplant. Zum Eintragen tippen.',

  'dialog.title': 'Neuer Termin',
  'dialog.summary': 'Titel',
  'dialog.calendar': 'Kalender',
  'dialog.date': 'Datum',
  'dialog.all_day': 'Ganztägig',
  'dialog.from': 'Von',
  'dialog.to': 'Bis',
  'dialog.note': 'Notiz',
  'dialog.cancel': 'Abbrechen',
  'dialog.save': 'Speichern',
  'dialog.saving': 'Speichert…',
  'dialog.no_writable':
    'Kein beschreibbarer Kalender eingerichtet. Ordne einem Familienmitglied Kalender zu oder nimm einen aus der schreibgeschützten Liste heraus.',
  'dialog.failed': 'Der Termin konnte nicht angelegt werden.',

  'people.home': 'Zuhause',
  'people.away': 'Unterwegs',

  'agenda.all_day': 'Ganztägig',
  'agenda.nothing_planned': 'Nichts geplant',
  'agenda.nothing_coming': 'Nichts in Sicht.',

  'lists.empty': 'Diese Liste ist leer',
  'lists.unreachable': 'Gerade nicht erreichbar',
  'lists.show_more': '{count} weitere anzeigen',
  'lists.add': 'Hinzufügen',
  'lists.add_placeholder': 'Eintrag hinzufügen',
  'lists.none_configured':
    'Keine Listen eingerichtet. Wähle eure Familienlisten in den Hearth-Optionen oder setze entities auf dieser Karte.',

  'routines.nothing_today': 'Heute nichts',
  'routines.auto': 'Automatisch (nach Tageszeit)',
  'routines.morning': 'Morgen',
  'routines.evening': 'Abend',
  'routines.both': 'Beide',
  'routines.none_configured':
    'Für heute sind keine Routinen hinterlegt. Trage sie in der Hearth-Integration unter „Konfigurieren → Routinen bearbeiten“ ein.',

  'timetable.no_periods':
    'Noch keine Stundenzeiten. Trage sie in der Hearth-Integration unter „Konfigurieren → Stundenplan“ ein.',
  'timetable.none_configured':
    'Noch hat niemand einen Stundenplan. Lege ihn in der Hearth-Integration unter „Konfigurieren → Stundenplan“ an.',
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

  'editor.board_entity': 'Board-Sensor',
  'editor.view': 'Startansicht',
  'editor.views': 'Verfügbare Ansichten',
  'editor.show_legend': 'Farblegende anzeigen',
  'editor.create': 'Termine per Tippen auf einen Tag anlegen',
  'editor.default_calendar': 'Vorausgewählter Kalender',
  'editor.max_events_per_day': 'Termine pro Tag vor „+N“',
  'editor.days': 'Tage im Voraus',
  'editor.max_events': 'Termine pro Tag',
  'editor.hide_empty_days': 'Tage ohne Termine ausblenden',
  'editor.show_events': 'Heutige Termine anzeigen',
  'editor.show_tasks': 'Offene Aufgaben anzeigen',
  'editor.show_points': 'Punkte anzeigen',
  'editor.entities': 'Aufgabenlisten',
  'editor.allow_add': 'Einträge hinzufügen erlauben',
  'editor.max_items': 'Einträge vor dem Einklappen',
  'editor.columns': 'Spalten',
  'editor.weather_entity': 'Wetter-Entität',
  'editor.greeting': 'Begrüßung',
  'editor.show_seconds': 'Sekunden anzeigen',
  'editor.block': 'Welcher Block angezeigt wird',
  'editor.evening_from': 'Abend beginnt um (Stunde)',
  'editor.show_empty': 'Mitglieder ohne Routine heute anzeigen',
  'editor.members': 'Auf diese Mitglieder beschränken',
  'editor.member': 'Familienmitglied',
  'editor.layout': 'Darstellung',
  'editor.week_days': 'Angezeigte Tage',
  'editor.show_rooms': 'Räume anzeigen',
  'editor.show_breaks': 'Pausen anzeigen',
  'editor.show_times': 'Stundenzeiten anzeigen',
  'editor.hide_empty_periods': 'Stunden ausblenden, die niemand hat',
  'editor.highlight': 'Heute und laufende Stunde hervorheben',
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
