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
  'timetable.exam': 'Exam',
  'routines.exam_tomorrow': 'Exam tomorrow',

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
  'admin.travel': 'Way to school (min)',
  'admin.travel_hint': 'Gives a leaving time that moves when the first lesson is cancelled. Empty for none.',
  'admin.leave_time': 'Leaves on school days at',
  'admin.care_leave_time': 'Leaves in holiday care at',
  'admin.leave_time_hint': 'For a bus or a lift, which comes at its time whatever is cancelled. Wins over the way to school.',
  'header.leave_in': 'leave in {minutes} min',
  'header.leave_now': 'time to go',
  'header.leave_at': 'leave at {time}',
  'admin.schedule_name': 'Name of the school',
  'admin.schedule_hint': 'Grammar school, primary school…',
  'admin.schedule_add': 'Another school with different times',
  'admin.schedule_remove': 'Remove {name}? Its lesson times go with it.',
  'admin.schedule_remove_one':
    'Remove {name}? {members} goes back to the usual lesson times.',
  'admin.schedule_remove_members':
    'Remove {name}? {members} go back to the usual lesson times.',
  'admin.periods_first': 'Set the lesson times first — the week hangs on them.',
  'admin.no_members': 'Nobody is set up yet. Add a family member first.',
  'admin.no_subjects': 'No subjects yet. They appear once a timetable has lessons in it.',
  'admin.subject': 'Subject',
  'admin.room': 'Room',
  'admin.name': 'Name',
  'admin.color': 'Colour',
  'admin.calendar': 'Own calendar',
  'admin.lessons_calendar': 'Lessons calendar from school',
  'admin.exams_calendar': 'Exams calendar from school',
  'admin.homework_list': 'Homework list from school',
  'admin.school_system': 'School system (WebUntis, Schulmanager or similar), optional',
  'admin.school_system_hint':
    'Calendars and lists a school system such as WebUntis or Schulmanager Online already keeps for this child: changes to the timetable, exams and new homework come from them. With WebUntis, switch on “Calendar - cancelled lessons” in its options.',
  'admin.avatar': 'Picture',
  'admin.block_morning': 'Morning',
  'admin.block_evening': 'Evening',
  'admin.day_free': 'Day off',
  'admin.day_care': 'Holiday care',
  'admin.steps_hint': 'One step per line',
  'admin.school_calendars': 'Calendars that close the school, one per line',
  'admin.care_keywords': 'Holiday-care keywords, one per line',
  'admin.care_hint': 'Holiday care',
  'admin.cancel_keywords': 'Words that mean a lesson is cancelled, one per line',
  'admin.cancel_hint': 'Cancelled',
  'admin.substitute_keywords': 'Words that mean somebody else is taking a lesson, one per line',
  'admin.substitute_hint': 'Irregular',
  'admin.school_words': 'Words from the school system',
  'admin.school_words_hint':
    'Already set for WebUntis. Only change them if your school system writes something else.',
  'admin.avatar_hint':
    'For a picture, put in a person entity — the one Home Assistant already has. A URL works too.',
  'admin.colors_hint':
    'Every subject already has a colour taken from its name. This is only for correcting one.',
  'admin.calendars_hint':
    'Any event running on these calendars means there is no school, so use calendars that hold nothing else.',
  'editor.weather_entity': 'Weather entity',
  'editor.greeting': 'Greeting',
  'editor.show_seconds': 'Show seconds',
  'editor.show_leave': 'Show when to leave for school',
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
  'timetable.exam': 'Arbeit',
  'routines.exam_tomorrow': 'Morgen Arbeit',

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
  'admin.travel': 'Weg zur Schule (Min.)',
  'admin.travel_hint': 'Ergibt eine Losgeh-Zeit, die sich verschiebt, wenn die erste Stunde ausfällt. Leer für keine.',
  'admin.leave_time': 'Losgehen an Schultagen um',
  'admin.care_leave_time': 'Losgehen in der Ferienbetreuung um',
  'admin.leave_time_hint': 'Für Bus oder Fahrgemeinschaft, die kommen, egal was ausfällt. Gilt vor dem Weg zur Schule.',
  'header.leave_in': 'los in {minutes} Min.',
  'header.leave_now': 'jetzt los!',
  'header.leave_at': 'los um {time}',
  'admin.schedule_name': 'Name der Schule',
  'admin.schedule_hint': 'Gymnasium, Grundschule …',
  'admin.schedule_add': 'Weitere Schule mit anderen Zeiten',
  'admin.schedule_remove': '{name} entfernen? Die Stundenzeiten gehen mit.',
  'admin.schedule_remove_one':
    '{name} entfernen? {members} kommt dann auf die üblichen Stundenzeiten.',
  'admin.schedule_remove_members':
    '{name} entfernen? {members} kommen dann auf die üblichen Stundenzeiten.',
  'admin.periods_first': 'Trage zuerst die Stundenzeiten ein — die Woche hängt daran.',
  'admin.no_members': 'Noch ist niemand angelegt. Lege zuerst ein Familienmitglied an.',
  'admin.no_subjects': 'Noch keine Fächer. Sie erscheinen, sobald ein Stundenplan Stunden hat.',
  'admin.subject': 'Fach',
  'admin.room': 'Raum',
  'admin.name': 'Name',
  'admin.color': 'Farbe',
  'admin.calendar': 'Eigener Kalender',
  'admin.lessons_calendar': 'Stundenplan-Kalender der Schule',
  'admin.exams_calendar': 'Klassenarbeiten-Kalender der Schule',
  'admin.homework_list': 'Hausaufgaben-Liste der Schule',
  'admin.school_system': 'Schulsystem (WebUntis, Schulmanager o. Ä.), optional',
  'admin.school_system_hint':
    'Kalender und Listen, die ein Schulsystem wie WebUntis oder Schulmanager Online schon für dieses Kind führt: Daraus kommen Änderungen am Stundenplan, Arbeiten und neue Hausaufgaben. Bei WebUntis dort in den Optionen „Kalender - Ausfallende Stunden“ einschalten.',
  'admin.avatar': 'Bild',
  'admin.block_morning': 'Morgens',
  'admin.block_evening': 'Abends',
  'admin.day_free': 'Freier Tag',
  'admin.day_care': 'Ferienbetreuung',
  'admin.steps_hint': 'Ein Schritt pro Zeile',
  'admin.school_calendars': 'Kalender, die die Schule schließen, einer pro Zeile',
  'admin.care_keywords': 'Betreuungs-Stichwörter, eines pro Zeile',
  'admin.care_hint': 'Ferienbetreuung',
  'admin.cancel_keywords': 'Wörter für eine ausgefallene Stunde, eines pro Zeile',
  'admin.cancel_hint': 'Entfall',
  'admin.substitute_keywords': 'Wörter für eine Vertretungsstunde, eines pro Zeile',
  'admin.substitute_hint': 'Vertretung',
  'admin.school_words': 'Wörter aus dem Schulsystem',
  'admin.school_words_hint':
    'Für WebUntis schon eingestellt. Nur ändern, wenn euer Schulsystem etwas anderes schreibt.',
  'admin.avatar_hint':
    'Für ein Bild eine Person-Entität eintragen — die, die Home Assistant schon kennt. Eine URL geht auch.',
  'admin.colors_hint':
    'Jedes Fach hat schon eine Farbe, abgeleitet aus seinem Namen. Das hier ist nur zum Korrigieren.',
  'admin.calendars_hint':
    'Jeder laufende Termin in diesen Kalendern bedeutet schulfrei — nimm also Kalender, in denen nichts anderes steht.',
  'editor.weather_entity': 'Wetter-Entität',
  'editor.greeting': 'Begrüßung',
  'editor.show_seconds': 'Sekunden anzeigen',
  'editor.show_leave': 'Losgeh-Zeit für die Schule anzeigen',
};

/**
 * Hebrew. The cards also turn right-to-left for it, which is not a string at all — see
 * `isRtl` below — so a translation alone would still draw the week backwards.
 */
const HE: Dict = {
  'board.missing': 'לא נמצא לוח של Schoolday. הוסיפו את האינטגרציה Schoolday.',
  'routines.nothing_today': 'אין כלום היום',
  'routines.auto': 'אוטומטי (לפי שעה ביום)',
  'routines.morning': 'בוקר',
  'routines.evening': 'ערב',
  'routines.both': 'שניהם',
  'routines.none_configured':
    'אין שגרות להיום. הוסיפו אותן תחת „הגדר“ ← עריכת שגרות באינטגרציה Schoolday.',
  'routines.sick': 'בבית, חולה',
  'routines.packed_for': 'בשביל {subject}',
  'timetable.sick': 'חולה',
  'timetable.event': 'אין לימודים רגילים',
  'timetable.changed': 'שינוי',
  'timetable.exam': 'מבחן',
  'routines.exam_tomorrow': 'מחר מבחן',
  'stats.percent': '{value}%',
  'stats.window': 'ב-{days} ימים',
  'stats.window_one': 'ביום אחד',
  'stats.streak': '{days} ימים ברצף',
  'stats.best': 'שיא {days}',
  'stats.day_done': '{done} מתוך {asked} בוצעו',
  'stats.nothing_asked': 'לא היה כלום',
  'stats.nothing_yet': 'עדיין אין רישום. הוא מתחיל ביום הלימודים הראשון.',
  'stats.none_configured':
    'אין שגרות לרשום. הוסיפו אותן תחת „הגדר“ ← עריכת שגרות באינטגרציה Schoolday.',
  'stats.sort_board': 'הסדר הרגיל של המשפחה',
  'stats.sort_rate': 'הרישום הטוב ביותר קודם',
  'homework.nothing': 'אין מה לעשות',
  'homework.all_done': 'אין שיעורי בית פתוחים.',
  'homework.overdue': 'באיחור',
  'homework.today': 'להיום',
  'homework.tomorrow': 'למחר',
  'homework.later': 'בהמשך',
  'homework.someday': 'בלי תאריך',
  'timetable.no_periods':
    'עדיין אין זמני שיעורים. הוסיפו אותם תחת „הגדר“ ← זמני שיעורים באינטגרציה Schoolday.',
  'timetable.none_configured':
    'לאף אחד עדיין אין מערכת שעות. הוסיפו אחת תחת „הגדר“ ← עריכת מערכת שעות באינטגרציה Schoolday.',
  'timetable.break': 'הפסקה',
  'timetable.no_school': 'אין לימודים',
  'timetable.free': 'חופש',
  'timetable.care': 'מסגרת בחופשה',
  'timetable.now': 'עכשיו',
  'timetable.next': 'הבא',
  'timetable.remaining': 'עוד {minutes} דק׳',
  'timetable.done_for_today': 'הלימודים להיום נגמרו.',
  'timetable.layout_auto': 'אוטומטי (שבוע, יום אחד כשצר)',
  'timetable.layout_week': 'כל השבוע',
  'timetable.layout_day': 'יום אחד',
  'timetable.days_auto': 'אוטומטי (לפי מה שהמערכת צריכה)',
  'timetable.days_school': 'שני עד שישי',
  'timetable.days_week': 'כל שבעת הימים',
  'editor.block': 'איזה חלק להציג',
  'editor.evening_from': 'הערב מתחיל בשעה',
  'editor.show_empty': 'להציג בני משפחה שאין להם כלום היום',
  'editor.show_done': 'להציג מה שכבר בוצע',
  'editor.members': 'רק בני המשפחה האלה',
  'editor.member': 'בן משפחה',
  'editor.layout': 'פריסה',
  'editor.week_days': 'ימים מוצגים',
  'editor.show_rooms': 'להציג חדרים',
  'editor.show_times': 'להציג זמני שיעורים',
  'editor.show_breaks': 'להציג הפסקות',
  'editor.hide_empty_periods': 'להסתיר שיעורים שאין לאף אחד',
  'editor.highlight': 'לסמן את היום ואת השיעור הנוכחי',
  'editor.roll_days': 'ימים שעברו עוברים לשבוע הבא',
  'editor.section': 'החלק שנפתח ראשון',
  'editor.days': 'ימים מוצגים',
  'editor.show_steps': 'להציג את הספירה לכל שלב',
  'editor.sort': 'סדר',
  'admin.tab_timetable': 'מערכת שעות',
  'admin.tab_routines': 'שגרות',
  'admin.tab_family': 'משפחה',
  'admin.tab_subjects': 'מקצועות',
  'admin.tab_holidays': 'ימי חופש',
  'admin.tab_materials': 'ציוד',
  'admin.tab_exceptions': 'חריגים',
  'admin.cycle_one': 'שבוע אחד',
  'admin.cycle_two': 'שבועיים (א׳/ב׳)',
  'admin.cycle_start': 'שבוע א׳ מתחיל בשבוע מספר',
  'admin.cycle_now': 'השבוע הוא שבוע {week}.',
  'admin.week_a': 'שבוע א׳',
  'admin.week_b': 'שבוע ב׳',
  'admin.exceptions_hint':
    'מה שתאריך אחד עושה אחרת. תווית תופסת את כל היום; הקישו על שיעור כדי לבטל אותו או לכתוב מה מתקיים במקומו. תאריכים שעברו נמחקים מעצמם.',
  'admin.exception_date': 'תאריך',
  'admin.exception_label': 'מה היום הזה',
  'admin.exception_label_hint': 'טיול שנתי, יום ספורט — השאירו ריק ליום רגיל',
  'admin.exception_cancel': 'בוטל',
  'admin.exception_reset': 'חזרה למערכת השעות',
  'admin.exception_none': 'אין שום שינוי בתאריך הזה.',
  'admin.exception_add': 'הוספת תאריך',
  'admin.materials_hint':
    'מה צריך להביא לכל מקצוע. הפריטים מופיעים בשגרת הערב ביום שלפני, למי שיש לו את המקצוע.',
  'admin.materials_items': 'פריט אחד בכל שורה',
  'admin.save': 'שמירה',
  'admin.add': 'הוספה',
  'admin.clear': 'ניקוי',
  'admin.remove': 'הסרה',
  'admin.remove_confirm': 'להסיר את {name}? גם מערכת השעות והשגרות יימחקו.',
  'admin.add_member': 'הוספת בן משפחה',
  'admin.periods': 'זמני שיעורים, אחד בכל שורה',
  'admin.schedule': 'בית ספר',
  'admin.schedule_default': 'הזמנים הרגילים',
  'admin.travel': 'הדרך לבית הספר (דק׳)',
  'admin.travel_hint': 'נותן שעת יציאה שזזה כשהשיעור הראשון מבוטל. ריק אם אין.',
  'admin.leave_time': 'יציאה בימי לימודים בשעה',
  'admin.care_leave_time': 'יציאה למסגרת בחופשה בשעה',
  'admin.leave_time_hint':
    'להסעה או טרמפ, שמגיעים בזמן שלהם לא משנה מה בוטל. גובר על הדרך לבית הספר.',
  'header.leave_in': 'יוצאים בעוד {minutes} דק׳',
  'header.leave_now': 'זמן לצאת',
  'header.leave_at': 'יוצאים ב-{time}',
  'admin.schedule_name': 'שם בית הספר',
  'admin.schedule_hint': 'תיכון, יסודי…',
  'admin.schedule_add': 'בית ספר נוסף עם זמנים אחרים',
  'admin.schedule_remove': 'להסיר את {name}? זמני השיעורים שלו יימחקו איתו.',
  'admin.schedule_remove_one': 'להסיר את {name}? {members} חוזר/ת לזמני השיעורים הרגילים.',
  'admin.schedule_remove_members': 'להסיר את {name}? {members} חוזרים לזמני השיעורים הרגילים.',
  'admin.periods_first': 'קודם הגדירו את זמני השיעורים — השבוע נבנה עליהם.',
  'admin.no_members': 'עדיין לא הוגדר אף אחד. הוסיפו קודם בן משפחה.',
  'admin.no_subjects': 'עדיין אין מקצועות. הם יופיעו ברגע שבמערכת שעות יהיו שיעורים.',
  'admin.subject': 'מקצוע',
  'admin.room': 'חדר',
  'admin.name': 'שם',
  'admin.color': 'צבע',
  'admin.calendar': 'לוח שנה פרטי',
  'admin.lessons_calendar': 'לוח שיעורים מבית הספר',
  'admin.exams_calendar': 'לוח מבחנים מבית הספר',
  'admin.homework_list': 'רשימת שיעורי בית מבית הספר',
  'admin.school_system': 'מערכת בית ספר (WebUntis, Schulmanager וכדומה), אופציונלי',
  'admin.school_system_hint':
    'לוחות שנה ורשימות שמערכת בית ספר כמו WebUntis או Schulmanager Online כבר מנהלת עבור הילד: מהם מגיעים שינויים במערכת השעות, מבחנים ושיעורי בית חדשים. ב-WebUntis, הפעילו באפשרויות שלה את “Calendar - cancelled lessons”.',
  'admin.avatar': 'תמונה',
  'admin.block_morning': 'בוקר',
  'admin.block_evening': 'ערב',
  'admin.day_free': 'יום חופש',
  'admin.day_care': 'מסגרת בחופשה',
  'admin.steps_hint': 'שלב אחד בכל שורה',
  'admin.school_calendars': 'לוחות שנה שסוגרים את בית הספר, אחד בכל שורה',
  'admin.care_keywords': 'מילות מפתח למסגרת בחופשה, אחת בכל שורה',
  'admin.care_hint': 'קייטנה',
  'admin.cancel_keywords': 'מילים שאומרות ששיעור בוטל, אחת בכל שורה',
  'admin.cancel_hint': 'בוטל',
  'admin.substitute_keywords': 'מילים שאומרות שמישהו אחר מעביר שיעור, אחת בכל שורה',
  'admin.substitute_hint': 'מילוי מקום',
  'admin.school_words': 'מילים ממערכת בית הספר',
  'admin.school_words_hint': 'כבר מוגדר ל-WebUntis. שנו רק אם מערכת בית הספר שלכם כותבת משהו אחר.',
  'admin.avatar_hint':
    'לתמונה, הכניסו ישות person — זו ש-Home Assistant כבר מכיר. גם כתובת URL עובדת.',
  'admin.colors_hint': 'לכל מקצוע כבר יש צבע שנלקח מהשם שלו. זה רק כדי לתקן אחד.',
  'admin.calendars_hint':
    'כל אירוע שפעיל בלוחות האלה אומר שאין לימודים, אז השתמשו בלוחות שאין בהם שום דבר אחר.',
  'editor.weather_entity': 'ישות מזג אוויר',
  'editor.greeting': 'ברכה',
  'editor.show_seconds': 'להציג שניות',
  'editor.show_leave': 'להציג מתי לצאת לבית הספר',
};

const DICTS: Record<string, Dict> = { en: EN, de: DE, he: HE };

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

/** Languages written right to left. Only those the cards ship strings for. */
const RTL_LANGUAGES = new Set(['he']);

/**
 * Whether the cards should lay themselves out right to left.
 *
 * Asked of Home Assistant's own language rather than of `document.dir`, so a card
 * rendered on its own — the docs shots, a preview — turns the same way as one on a
 * dashboard.
 */
export function isRtl(hass?: HomeAssistant): boolean {
  return RTL_LANGUAGES.has(language(hass));
}

/** Languages the cards ship strings for. */
export const SUPPORTED_LANGUAGES = Object.keys(DICTS);
