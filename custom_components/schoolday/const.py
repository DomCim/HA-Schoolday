"""Constants for the Schoolday integration."""

from __future__ import annotations

from typing import Final

DOMAIN: Final = "schoolday"

# Keep in sync with manifest.json, package.json and src/lib/const.ts.
VERSION: Final = "0.11.1"

# Where the bundled Lovelace cards are served from.
FRONTEND_URL_BASE: Final = "/schoolday-frontend"
FRONTEND_DIR: Final = "frontend"
PANEL_FILENAME: Final = "schoolday-panel.js"

# hass.data key guarding one-time frontend registration.
DATA_FRONTEND_REGISTERED: Final = f"{DOMAIN}_frontend_registered"

# --- Options keys -----------------------------------------------------------

CONF_MEMBERS: Final = "members"
CONF_ROUTINES: Final = "routines"
CONF_TIMETABLE: Final = "timetable"

# Calendars whose events mean "no school today" — holidays, teacher training days.
# The one thing a timetable cannot know by itself.
CONF_SCHOOL_CALENDARS: Final = "school_calendars"

# What an event has to say for the day to count as holiday care. Matched against the
# events on a member's own calendar, case-insensitively, anywhere in the title.
# A list, because a household may call it two things, and free text, because every
# country calls it something else.
CONF_CARE_KEYWORDS: Final = "care_keywords"

# Only a suggestion, and only for the languages this integration ships strings for.
# Guessing a word for a language we do not speak would be worse than an empty field.
SUGGESTED_CARE_KEYWORDS: Final[dict[str, str]] = {
    "de": "Ferienbetreuung\nHort",
    "en": "Holiday club\nHoliday care",
}

# Routine blocks. Two is deliberate: a wall panel should show what is due now,
# and "before school" versus "before bed" is the split that actually matters.
BLOCK_MORNING: Final = "morning"
BLOCK_EVENING: Final = "evening"
ROUTINE_BLOCKS: Final[tuple[str, ...]] = (BLOCK_MORNING, BLOCK_EVENING)

# What kind of day it is for one child. A routine has a list per weekday plus one for
# each of the other two, because a holiday morning is not a school morning with bits
# removed — it is its own short list.
MODE_SCHOOL: Final = "school"
MODE_CARE: Final = "care"
MODE_FREE: Final = "free"

# A child who is at home ill. Deliberately not a routine key like the two above: there
# is no list for it, because being ill is the absence of a day rather than a kind of
# one. It closes the day for that child alone, which is what tells it apart from a
# holiday — and it is what makes the morning announcement skip them with no second
# condition to maintain.
MODE_SICK: Final = "sick"

# A day the school has taken over: a trip, a sports day, a parents' evening. Its own
# mode rather than a holiday, because it is neither free nor care — the child is at
# school, just not at their timetable.
MODE_EVENT: Final = "event"
#: Routine keys for the two non-school days, alongside the weekday keys "0".."6".
ROUTINE_HOLIDAY: Final = MODE_FREE
ROUTINE_CARE: Final = MODE_CARE
ROUTINE_EXTRA_KEYS: Final[tuple[str, ...]] = (ROUTINE_HOLIDAY, ROUTINE_CARE)

# Weekday keys are 0 = Monday, matching datetime.weekday() — and Chores4Kids,
# so the household only has to learn one numbering.
WEEKDAYS: Final[tuple[str, ...]] = ("0", "1", "2", "3", "4", "5", "6")

# --- Timetable --------------------------------------------------------------

CONF_PERIODS: Final = "periods"
CONF_SUBJECT_COLORS: Final = "colors"
CONF_LESSONS: Final = "lessons"

# How many weeks the timetable takes to repeat: 1 for the usual one, 2 for schools that
# alternate an A week and a B week.
#
# The week is not a second dimension in the stored data. A day is a *slot*: 0..6 is week
# A's Monday to Sunday and 7..13 is week B's, so a one-week timetable is simply one that
# never uses a slot above 6 — and every timetable written before this existed is already
# a valid two-week one. Nothing had to be migrated, and turning the cycle off does not
# throw week B away.
CONF_CYCLE_WEEKS: Final = "cycle_weeks"

# The Monday of a week that is week A. Everything else follows by counting.
#
# A date rather than "this week is A", because the answer has to keep being right next
# term: a stored flag would mean whatever it meant on the day somebody pressed it.
CONF_CYCLE_ANCHOR: Final = "cycle_anchor"

#: Days in one week, and therefore the distance between week A's slots and week B's.
SLOTS_PER_WEEK: Final = 7
CYCLE_MAX_WEEKS: Final = 2

# What a subject needs brought along: subject -> list of things. Household-wide rather
# than per child, because a PE bag is a PE bag whoever carries it.
#
# This is the one place the timetable and the routines are allowed to know about each
# other. Typing "pack the PE kit" into Monday evening states the same fact twice — that
# there is PE on Tuesday — and the second copy is the one nobody updates when the
# timetable changes.
CONF_MATERIALS: Final = "materials"

# What one particular date does differently: member id -> "YYYY-MM-DD" -> the change.
#
# A timetable repeats forever, which is what makes it worth typing in once and also
# what makes it lie the moment a lesson is cancelled. This is the layer that says
# otherwise, and it is deliberately thin: dates, not rules. Past dates are dropped on
# every write, so it can never grow into a second timetable nobody maintains.
CONF_EXCEPTIONS: Final = "exceptions"

# Inside one exception.
CONF_LABEL: Final = "label"

# A gap this long between two periods is a break, and is drawn as one. Deriving
# breaks from the lesson times means there is nothing extra to configure.
BREAK_MIN_MINUTES: Final = 5

# Written instead of a subject to leave a period deliberately empty.
FREE_MARKERS: Final[frozenset[str]] = frozenset(
    {"-", "--", "---", "–", "—", "x", "frei", "free", "."}
)

# Colours handed to subjects that have none, picked by a stable hash of the name so
# a subject keeps its colour for good — and keeps it across every member.
SUBJECT_COLORS: Final[list[str]] = [
    "#3a86c8",
    "#4f9d69",
    "#e0603a",
    "#8e6bbf",
    "#c9a227",
    "#2a9d8f",
    "#d1707f",
    "#7a8b3a",
    "#b5651d",
    "#5a7d9a",
    "#a05195",
    "#47845c",
]

CONF_MEMBER_ID: Final = "id"
CONF_NAME: Final = "name"
CONF_COLOR: Final = "color"
CONF_AVATAR: Final = "avatar"
CONF_ORDER: Final = "order"
# This member's own calendar, searched for the holiday-care keyword and nothing else.
CONF_CALENDAR: Final = "calendar"

# --- Entity attributes exposed to the cards ---------------------------------

# Marker the cards use to locate the board sensor, so renaming it does not break them.
ATTR_BOARD: Final = "schoolday_board"

# Everything the options flow can change, for the management card. Deliberately apart
# from the display attributes: the wall cards should not carry settings nobody reads.
ATTR_ADMIN: Final = "admin"

ATTR_MEMBER_ID: Final = "member_id"
ATTR_MEMBERS: Final = "members"
ATTR_COLOR: Final = "color"
ATTR_AVATAR: Final = "avatar"
ATTR_VERSION: Final = "version"
ATTR_ROUTINE_MORNING: Final = "routine_morning"
ATTR_ROUTINE_EVENING: Final = "routine_evening"
ATTR_ROUTINE_BLOCKS: Final = "routine_blocks"

# The lesson grid — periods, breaks and subject colours — on the board sensor; one
# member's week on their own sensor, which keeps either attribute set small.
ATTR_TIMETABLE: Final = "timetable"

# Today's lessons, ready for a template: the morning announcement should not have to
# work out which weekday it is and index into a week.
ATTR_TODAY: Final = "today"
ATTR_TODAY_SUBJECTS: Final = "today_subjects"
ATTR_TODAY_SUMMARY: Final = "today_summary"
ATTR_LESSON_NOW: Final = "lesson_now"
ATTR_LESSON_NEXT: Final = "lesson_next"
ATTR_SUBJECT: Final = "subject"
ATTR_ROOM: Final = "room"
ATTR_PERIOD: Final = "period"

# Whether school is on at all today, and what is keeping it shut if not.
ATTR_SCHOOL_TODAY: Final = "school_today"
ATTR_NO_SCHOOL: Final = "no_school_reason"

# What kind of day this member is having: school, care, free or sick.
ATTR_DAY_MODE: Final = "day_mode"

# This week and the next seven days, in date order. A timetable repeats forever, but
# holidays and holiday care do not: without this the grid can only ever say what a
# Tuesday is usually like, never what the Tuesday you are looking at actually holds.
# A list rather than a map keyed by weekday, because the window reaches back to Monday
# and so the same weekday can appear twice — only the card knows which one it wants.
ATTR_OUTLOOK: Final = "outlook"
ATTR_DATE: Final = "date"
ATTR_MODE: Final = "mode"
ATTR_WEEKDAY: Final = "weekday"
ATTR_LABEL: Final = "label"

# How far ahead the outlook reaches from today. Seven days is exactly one of every
# weekday, so every column has a future date to point at; the window also runs back to
# Monday so the week as it stands can be shown instead.
OUTLOOK_DAYS: Final = 7

# The state of a member sensor when no lesson is running: a plain token rather than
# a translated word, because automations compare against it.
STATE_FREE: Final = "free"

# Fired at every lesson boundary. A state change cannot stand in for these: two
# periods of the same subject in a row are one state but two lessons.
EVENT_LESSON_STARTED: Final = f"{DOMAIN}_lesson_started"
EVENT_LESSON_ENDED: Final = f"{DOMAIN}_lesson_ended"

# --- Routine completion state ------------------------------------------------

# Which steps are ticked off today. Deliberately not in the config entry: this
# changes many times a day and would rewrite the configuration each time.
STORAGE_KEY: Final = f"{DOMAIN}.routine_state"
STORAGE_VERSION: Final = 1

DATA_STORE: Final = f"{DOMAIN}_store"
SIGNAL_ROUTINE_UPDATED: Final = f"{DOMAIN}_routine_updated"

# --- What actually got done, day by day ---------------------------------------

# The ticks above are wiped every midnight, and rightly so: a wall panel still showing
# yesterday's is a wall panel nobody believes. But wiping them also throws away the only
# answer to the question a parent actually has — is the evening routine working, or is
# it the same three steps that never happen? So the day is written down as it goes.
STORAGE_KEY_HISTORY: Final = f"{DOMAIN}.routine_history"

DATA_HISTORY: Final = f"{DOMAIN}_history"

# How many days are kept, and therefore how far the statistics reach back. Four weeks
# and change: long enough that every weekday has four samples, short enough that the
# whole record still fits in a sensor attribute — and short enough to be a record of
# how things are going rather than a permanent file on a child.
HISTORY_DAYS: Final = 30

# The record on a member's sensor: the daily totals, the per-step tallies and the
# figures worth triggering an automation on.
ATTR_ROUTINE_STATS: Final = "routine_stats"
ATTR_DAYS: Final = "days"
ATTR_BLOCKS: Final = "blocks"
ATTR_ASKED: Final = "asked"
ATTR_RATE: Final = "rate"
ATTR_STREAK: Final = "streak"
ATTR_BEST_STREAK: Final = "best_streak"

# --- Who is at home ill -------------------------------------------------------

# Also out of the config entry, and for the same reason. Stored as a date per member
# rather than a flag: a flag has to be turned off by somebody remembering to, and the
# one thing worse than a board that does not know a child is ill is a board that still
# thinks so a week later.
STORAGE_KEY_ABSENCE: Final = f"{DOMAIN}.absence"

DATA_ABSENCE: Final = f"{DOMAIN}_absence"
SIGNAL_ABSENCE_UPDATED: Final = f"{DOMAIN}_absence_updated"

# --- Homework -----------------------------------------------------------------

# Also out of the config entry: homework is written and ticked off daily, and the one
# thing it must never do is rewrite the household's configuration.
#
# A `todo` list rather than an attribute of Schoolday's own: Home Assistant already has
# a shape for "things still to do", and it comes with a voice interface, a card, a
# calendar view and an API Schoolday would otherwise have to invent worse versions of.
STORAGE_KEY_HOMEWORK: Final = f"{DOMAIN}.homework"

DATA_HOMEWORK: Final = f"{DOMAIN}_homework"
SIGNAL_HOMEWORK_UPDATED: Final = f"{DOMAIN}_homework_updated"

# On the todo entity, so a card can find the right list and draw it without asking for
# the items over the service API.
ATTR_HOMEWORK: Final = "homework"
ATTR_HOMEWORK_OPEN: Final = "open"
ATTR_DUE: Final = "due"
ATTR_UID: Final = "uid"
ATTR_SUMMARY: Final = "summary"

SERVICE_SET_ABSENT: Final = "set_absent"
ATTR_ABSENT: Final = "absent"
ATTR_UNTIL: Final = "until"

# Until when this member is ill, on their sensor. Null when they are not.
ATTR_SICK_UNTIL: Final = "sick_until"

SERVICE_SET_ROUTINE_STEP: Final = "set_routine_step"
SERVICE_RESET_ROUTINE: Final = "reset_routine"

# Services that write the configuration itself, so a card can offer what the options
# flow offers. They validate exactly what the options flow validates — a card must not
# be able to write a timetable the sensors can no longer read.
SERVICE_SET_PERIODS: Final = "set_periods"
SERVICE_SET_LESSON: Final = "set_lesson"
SERVICE_SET_DAY: Final = "set_day"
SERVICE_SET_ROUTINE: Final = "set_routine"
SERVICE_SET_SUBJECT_COLOR: Final = "set_subject_color"
SERVICE_SET_MEMBER: Final = "set_member"
SERVICE_REMOVE_MEMBER: Final = "remove_member"
SERVICE_SET_CALENDARS: Final = "set_calendars"
SERVICE_SET_MATERIALS: Final = "set_materials"
SERVICE_SET_EXCEPTION: Final = "set_exception"
SERVICE_SET_CYCLE: Final = "set_cycle"
SERVICE_CLEAR_EXCEPTION: Final = "clear_exception"

ATTR_WEEKDAY_FIELD: Final = "weekday"
ATTR_SUBJECT_FIELD: Final = "subject"
ATTR_ROOM_FIELD: Final = "room"
ATTR_LESSONS: Final = "lessons"
ATTR_STEPS: Final = "steps"
ATTR_DAY: Final = "day"
ATTR_PERIODS: Final = "periods"
ATTR_NAME: Final = "name"
ATTR_KEYWORDS: Final = "care_keywords"
ATTR_CALENDAR_FIELD: Final = "school_calendars"
ATTR_ITEMS: Final = "items"
ATTR_DATE_FIELD: Final = "date"
ATTR_LABEL_FIELD: Final = "label"
ATTR_CANCELLED: Final = "cancelled"

# What a dated day does differently from the week it belongs to, on the outlook entry
# for that day. Only present where there is something to say, so the usual week costs
# nothing: period -> the replacement lesson, or null for a period that is cancelled.
ATTR_CHANGES: Final = "changes"

# Which week of the cycle a dated day falls in: 0 for A, 1 for B. Always present, and
# always 0 while the cycle is one week — so a card never has to ask whether it applies.
ATTR_WEEK: Final = "week"

ATTR_WEEKS: Final = "weeks"
ATTR_ANCHOR: Final = "anchor"

# The packing list a subject generates, next to the steps somebody typed. Marked as
# such on the step itself so a card can say where it came from — and so nobody goes
# looking for it in the routine they can edit.
ATTR_FROM_SUBJECT: Final = "subject"

ATTR_MEMBER: Final = "member"
ATTR_BLOCK: Final = "block"
ATTR_STEP: Final = "step"
ATTR_DONE: Final = "done"

# Fallback colour cycle, mirrors DEFAULT_MEMBER_COLORS in src/lib/const.ts.
DEFAULT_COLORS: Final[list[str]] = [
    "#e0603a",
    "#3a86c8",
    "#4f9d69",
    "#c9a227",
    "#8e6bbf",
    "#d1707f",
]
