"""Typed view over the config entry options.

The config entry options are the single source of truth for Schoolday's configuration.
This module is the only place that knows their raw shape; everything else works with
:class:`Member` and :class:`SchooldayConfig`.
"""

from __future__ import annotations

import re
from collections.abc import Iterable
from dataclasses import dataclass, field
from datetime import date, timedelta
from typing import Any
from zlib import crc32

from .const import (
    BREAK_MIN_MINUTES,
    CONF_AVATAR,
    CONF_CALENDAR,
    CONF_CARE_KEYWORDS,
    CONF_COLOR,
    CONF_CYCLE_ANCHOR,
    CONF_CYCLE_WEEKS,
    CYCLE_MAX_WEEKS,
    CONF_EXCEPTIONS,
    CONF_LABEL,
    CONF_LESSONS,
    CONF_MEMBER_ID,
    CONF_MEMBERS,
    CONF_NAME,
    CONF_ORDER,
    CONF_PERIODS,
    CONF_ROUTINES,
    CONF_SCHOOL_CALENDARS,
    CONF_SUBJECT_COLORS,
    CONF_TIMETABLE,
    DEFAULT_COLORS,
    FREE_MARKERS,
    CONF_MATERIALS,
    MODE_CARE,
    MODE_FREE,
    MODE_SICK,
    ROUTINE_BLOCKS,
    ROUTINE_CARE,
    ROUTINE_HOLIDAY,
    SLOTS_PER_WEEK,
    SUBJECT_COLORS,
)


def steps_from_text(text: str | None) -> list[str]:
    """Parse a multi-line options field into routine steps, one per line."""
    if not text:
        return []
    return [line.strip() for line in text.splitlines() if line.strip()]


def text_from_steps(steps: list[str] | None) -> str:
    """Render steps back into the multi-line field the options flow shows."""
    return "\n".join(steps or [])


def color_to_hex(value: Any) -> str | None:
    """Normalise a colour to ``#rrggbb``.

    ColorRGBSelector yields ``[r, g, b]``; hand-written options may already be hex.
    """
    if value is None:
        return None
    if isinstance(value, str):
        text = value.strip()
        return text if text.startswith("#") else f"#{text}"
    if isinstance(value, (list, tuple)) and len(value) == 3:
        return "#{:02x}{:02x}{:02x}".format(*(int(component) for component in value))
    return None


def hex_to_rgb(value: str | None) -> list[int] | None:
    """Turn ``#rrggbb`` back into ``[r, g, b]`` for ColorRGBSelector."""
    if not value:
        return None
    text = value.lstrip("#")
    if len(text) != 6:
        return None
    try:
        return [int(text[index : index + 2], 16) for index in (0, 2, 4)]
    except ValueError:
        return None


@dataclass(slots=True)
class Member:
    """One family member."""

    id: str
    name: str
    color: str
    avatar: str | None = None
    order: int = 0
    #: This member's own calendar, if they have one. Only ever read for the
    #: holiday-care keyword — Schoolday shows no events anywhere.
    calendar: str | None = None

    @classmethod
    def from_dict(cls, data: dict[str, Any], index: int = 0) -> Member:
        """Build a member from its stored representation."""
        return cls(
            id=data[CONF_MEMBER_ID],
            name=data[CONF_NAME],
            color=color_to_hex(data.get(CONF_COLOR))
            or DEFAULT_COLORS[index % len(DEFAULT_COLORS)],
            avatar=data.get(CONF_AVATAR) or None,
            order=int(data.get(CONF_ORDER, index)),
            calendar=data.get(CONF_CALENDAR) or None,
        )

    def as_card_dict(self) -> dict[str, Any]:
        """Shape handed to the Lovelace cards via the board sensor's attributes."""
        return {
            "id": self.id,
            "name": self.name,
            "color": self.color,
            "avatar": self.avatar,
            "order": self.order,
        }

    def as_admin_dict(self) -> dict[str, Any]:
        """As above, plus the calendar — which only something editing them needs."""
        return {**self.as_card_dict(), "calendar": self.calendar}


@dataclass(slots=True)
class Routine:
    """One member's steps for one block: a list per weekday, plus the days off.

    Deliberately independent of the timetable: "pack the PE kit" belongs to the
    evening before, so it is a step on the days that have PE rather than something
    derived from the lesson grid.

    A holiday morning is not a school morning with items crossed out — it is its own
    short list — so the days off get their own lists rather than a rule.
    """

    by_weekday: dict[int, list[str]] = field(default_factory=dict)
    #: A day with no school at all.
    holiday: list[str] = field(default_factory=list)
    #: A holiday spent in care, which needs the lunchbox but not the school bag.
    care: list[str] = field(default_factory=list)

    @classmethod
    def from_dict(cls, data: dict[str, Any] | None) -> Routine:
        """Build from the stored ``{"0": [...], "free": [...], "care": [...]}`` shape."""
        by_weekday: dict[int, list[str]] = {}
        extra: dict[str, list[str]] = {ROUTINE_HOLIDAY: [], ROUTINE_CARE: []}
        for key, steps in (data or {}).items():
            if not steps:
                continue
            if key in extra:
                extra[key] = [str(step) for step in steps]
                continue
            try:
                weekday = int(key)
            except (TypeError, ValueError):
                continue
            if 0 <= weekday <= 6:
                by_weekday[weekday] = [str(step) for step in steps]
        return cls(
            by_weekday=by_weekday,
            holiday=extra[ROUTINE_HOLIDAY],
            care=extra[ROUTINE_CARE],
        )

    def steps_for(self, weekday: int, mode: str = "school") -> list[str]:
        """Steps for today, given what kind of day it is.

        A care day with no list of its own falls back to the holiday list: being in
        care is a holiday first, so that is the better wrong answer of the two.

        A child at home ill has no list at all, and deliberately no fallback either:
        a holiday list says "swimming things" and a sick day is not a holiday.
        """
        if mode == MODE_SICK:
            return []
        if mode == MODE_CARE:
            return self.care or self.holiday
        if mode == MODE_FREE:
            return self.holiday
        return self.by_weekday.get(weekday, [])

    @property
    def is_empty(self) -> bool:
        """True when no day has any step."""
        return not any(self.by_weekday.values()) and not self.holiday and not self.care

    def as_admin_dict(self) -> dict[str, list[str]]:
        """Every day's steps, in the stored key shape, for an editor to show.

        The cards only ever need today's steps; something offering to edit them needs
        all of it, which is why this is not what rides on the member sensors.
        """
        days: dict[str, list[str]] = {
            str(weekday): list(steps) for weekday, steps in sorted(self.by_weekday.items())
        }
        if self.holiday:
            days[ROUTINE_HOLIDAY] = list(self.holiday)
        if self.care:
            days[ROUTINE_CARE] = list(self.care)
        return days


# --- Timetable ---------------------------------------------------------------

#: "08:00-08:45", tolerating "8.00 – 8:45" and the like.
_PERIOD_RE = re.compile(r"^(\d{1,2})[:.h](\d{2})\s*[-–—]+\s*(\d{1,2})[:.h](\d{2})$")
#: "3. Mathe" — an explicit period number, so a day that starts late needs no filler.
_INDEX_RE = re.compile(r"^(\d{1,2})\s*[.):]\s*(.*)$")
#: The room is whatever follows the separator: "Mathe | 1.OG 5" or "Mathe @ Turnhalle".
_ROOM_SPLIT_RE = re.compile(r"\s*[|@]\s*")


class InvalidPeriod(ValueError):
    """A lesson-time line that is not ``HH:MM-HH:MM``."""

    def __init__(self, line: str) -> None:
        """Remember the offending line so the options flow can quote it."""
        super().__init__(line)
        self.line = line


def subject_color(subject: str) -> str:
    """The colour a subject gets when nobody picked one.

    Derived from the name rather than from the order it was typed in, so Maths is the
    same colour on every child's card and stays that colour when the week is rewritten.
    """
    digest = crc32(subject.strip().casefold().encode("utf-8"))
    return SUBJECT_COLORS[digest % len(SUBJECT_COLORS)]


@dataclass(slots=True)
class Period:
    """One lesson slot of the day, shared by the whole household."""

    index: int
    start: str
    end: str

    @property
    def start_minutes(self) -> int:
        """Minutes since midnight the period starts at."""
        hour, minute = self.start.split(":")
        return int(hour) * 60 + int(minute)

    @property
    def end_minutes(self) -> int:
        """Minutes since midnight the period ends at."""
        hour, minute = self.end.split(":")
        return int(hour) * 60 + int(minute)

    def as_card_dict(self) -> dict[str, Any]:
        """Shape handed to the cards."""
        return {"index": self.index, "start": self.start, "end": self.end}


@dataclass(slots=True)
class Lesson:
    """One subject in one period, on one weekday."""

    period: int
    subject: str
    room: str | None = None

    def as_card_dict(self) -> dict[str, Any]:
        """Shape handed to the cards."""
        return {"period": self.period, "subject": self.subject, "room": self.room}


def periods_from_text(text: str | None) -> list[Period]:
    """Parse the lesson-times field, one ``HH:MM-HH:MM`` per line.

    Raises :class:`InvalidPeriod` on the first line that is not a time range, so the
    options flow can point at it instead of silently dropping a lesson.
    """
    periods: list[Period] = []
    for line in (text or "").splitlines():
        stripped = line.strip()
        if not stripped:
            continue
        match = _PERIOD_RE.match(stripped)
        if not match:
            raise InvalidPeriod(stripped)
        start_h, start_m, end_h, end_m = (int(value) for value in match.groups())
        if not (0 <= start_h < 24 and 0 <= end_h < 24 and start_m < 60 and end_m < 60):
            raise InvalidPeriod(stripped)
        periods.append(
            Period(
                index=len(periods) + 1,
                start=f"{start_h:02d}:{start_m:02d}",
                end=f"{end_h:02d}:{end_m:02d}",
            )
        )
    periods.sort(key=lambda period: period.start_minutes)
    for index, period in enumerate(periods, start=1):
        period.index = index
    return periods


def text_from_periods(periods: list[Period]) -> str:
    """Render the periods back into the field they were typed in."""
    return "\n".join(f"{period.start}-{period.end}" for period in periods)


def lessons_from_text(text: str | None, period_count: int) -> list[Lesson]:
    """Parse one weekday's lessons, one per line, in period order.

    ``Mathe | 1.OG 5`` puts the room next to the subject, ``-`` leaves a period free,
    and a line may name its period explicitly (``5. Sport``) so a day that starts at
    the third period does not need two placeholder lines first.
    """
    lessons: list[Lesson] = []
    slot = 1
    for line in (text or "").splitlines():
        stripped = line.strip()
        if not stripped:
            continue

        if match := _INDEX_RE.match(stripped):
            slot = int(match.group(1))
            stripped = match.group(2).strip()
            # "3." on its own skips to that period without filling it.
            if not stripped:
                continue

        if slot > period_count:
            break

        parts = _ROOM_SPLIT_RE.split(stripped, maxsplit=1)
        subject = parts[0].strip()
        room = parts[1].strip() if len(parts) > 1 else ""
        if subject and subject.casefold() not in FREE_MARKERS:
            lessons.append(Lesson(period=slot, subject=subject, room=room or None))
        slot += 1

    lessons.sort(key=lambda lesson: lesson.period)
    return lessons


def unify_subjects(week: dict[int, list[Lesson]]) -> None:
    """Settle on one spelling per subject within a week, in place.

    Subject names are free text — anything can be a subject, and nothing here knows
    what a school teaches. That makes them exact strings everywhere downstream: the
    sensor state, the colour, and whatever an automation compares against. Typing
    "Sport" on Monday and "sport" on Wednesday would therefore be two subjects, two
    colours, and an announcement that catches half the week.

    The first spelling in the week wins, which is the one the household meant. Only
    within the week being saved: unifying across members would quietly undo a
    deliberate rename.
    """
    canonical: dict[str, str] = {}
    for weekday in sorted(week):
        for lesson in week[weekday]:
            lesson.subject = canonical.setdefault(lesson.subject.casefold(), lesson.subject)


def text_from_lessons(lessons: list[Lesson]) -> str:
    """Render one weekday back into the field it was typed in.

    Free periods come back as ``-`` so the lines keep lining up with the times.
    """
    if not lessons:
        return ""
    by_period = {lesson.period: lesson for lesson in lessons}
    lines: list[str] = []
    for slot in range(1, max(by_period) + 1):
        lesson = by_period.get(slot)
        if lesson is None:
            lines.append("-")
        elif lesson.room:
            lines.append(f"{lesson.subject} | {lesson.room}")
        else:
            lines.append(lesson.subject)
    return "\n".join(lines)


@dataclass(slots=True)
class Timetable:
    """The school timetable: one grid of periods, one week per member.

    Like the routines, this is typed in once — a timetable is fixed for a school
    year — rather than read from a calendar that would have to hold 40 events a week.
    """

    periods: list[Period] = field(default_factory=list)
    #: subject -> "#rrggbb", only where somebody picked a colour
    colors: dict[str, str] = field(default_factory=dict)
    #: member id -> weekday (0 = Monday) -> lessons
    lessons: dict[str, dict[int, list[Lesson]]] = field(default_factory=dict)

    @classmethod
    def from_dict(cls, data: dict[str, Any] | None) -> Timetable:
        """Build from the stored options."""
        raw = data or {}
        try:
            periods = periods_from_text("\n".join(raw.get(CONF_PERIODS) or []))
        except InvalidPeriod:
            # Hand-edited options should not take the whole integration down.
            periods = []

        colors = {
            str(subject): hex_value
            for subject, value in (raw.get(CONF_SUBJECT_COLORS) or {}).items()
            if (hex_value := color_to_hex(value))
        }

        lessons: dict[str, dict[int, list[Lesson]]] = {}
        for member_id, week in (raw.get(CONF_LESSONS) or {}).items():
            days: dict[int, list[Lesson]] = {}
            for day_key, slots in (week or {}).items():
                try:
                    slot = int(day_key)
                except (TypeError, ValueError):
                    continue
                # 0..6 is week A, 7..13 is week B. A timetable written before the
                # cycle existed only ever uses the first seven, so it needs no
                # migration: it is already a valid two-week one that never uses B.
                if not 0 <= slot < SLOTS_PER_WEEK * CYCLE_MAX_WEEKS:
                    continue
                day: list[Lesson] = []
                for period_key, entry in (slots or {}).items():
                    try:
                        period = int(period_key)
                    except (TypeError, ValueError):
                        continue
                    subject = str((entry or {}).get("subject") or "").strip()
                    if not subject:
                        continue
                    room = str((entry or {}).get("room") or "").strip() or None
                    day.append(Lesson(period=period, subject=subject, room=room))
                if day:
                    days[slot] = sorted(day, key=lambda lesson: lesson.period)
            if days:
                lessons[str(member_id)] = days
        return cls(periods=periods, colors=colors, lessons=lessons)

    def as_options(self) -> dict[str, Any]:
        """The stored shape, ready to be written back into the config entry."""
        return {
            CONF_PERIODS: [f"{p.start}-{p.end}" for p in self.periods],
            CONF_SUBJECT_COLORS: dict(self.colors),
            CONF_LESSONS: {
                member_id: {
                    str(weekday): {
                        str(lesson.period): {
                            "subject": lesson.subject,
                            "room": lesson.room,
                        }
                        for lesson in day
                    }
                    for weekday, day in sorted(week.items())
                }
                for member_id, week in self.lessons.items()
            },
        }

    def week(self, member_id: str) -> dict[int, list[Lesson]]:
        """One member's cycle, empty when they have no timetable.

        Keyed by slot: 0..6 is week A, 7..13 is week B.
        """
        return self.lessons.get(member_id, {})

    def day(self, member_id: str, slot: int) -> list[Lesson]:
        """One member's lessons in one slot of the cycle."""
        return self.week(member_id).get(slot, [])

    @property
    def uses_second_week(self) -> bool:
        """True when anything is written into week B.

        Asked before offering to turn the cycle off, because that is the moment the
        household is about to hide work they have done.
        """
        return any(
            slot >= SLOTS_PER_WEEK and lessons
            for week in self.lessons.values()
            for slot, lessons in week.items()
        )

    @property
    def subjects(self) -> list[str]:
        """Every subject in use, plus any that were given a colour, sorted."""
        names = {
            lesson.subject
            for week in self.lessons.values()
            for day in week.values()
            for lesson in day
        }
        names.update(self.colors)
        return sorted(names, key=str.casefold)

    def color(self, subject: str) -> str:
        """The colour of a subject: the one that was picked, or a stable default."""
        return self.colors.get(subject) or subject_color(subject)

    @property
    def breaks(self) -> list[dict[str, Any]]:
        """The gaps between periods, so breaks never have to be configured.

        Anything from :data:`BREAK_MIN_MINUTES` upwards counts — which is exactly the
        five-, ten- and sixty-minute gaps a school day already has in its times.
        """
        gaps: list[dict[str, Any]] = []
        for before, after in zip(self.periods, self.periods[1:]):
            minutes = after.start_minutes - before.end_minutes
            if minutes >= BREAK_MIN_MINUTES:
                gaps.append(
                    {
                        "after": before.index,
                        "start": before.end,
                        "end": after.start,
                        "minutes": minutes,
                    }
                )
        return gaps

    def period_at(self, minutes: int) -> Period | None:
        """The period running at a point in the day, if any."""
        return next(
            (
                period
                for period in self.periods
                if period.start_minutes <= minutes < period.end_minutes
            ),
            None,
        )

    def lesson_at(self, member_id: str, weekday: int, minutes: int) -> tuple[Lesson, Period] | None:
        """The lesson a member has at a point in the day, if any."""
        period = self.period_at(minutes)
        if period is None:
            return None
        lesson = next(
            (item for item in self.day(member_id, weekday) if item.period == period.index),
            None,
        )
        return (lesson, period) if lesson else None

    def next_lesson(
        self, member_id: str, weekday: int, minutes: int
    ) -> tuple[Lesson, Period] | None:
        """The member's next lesson that day, skipping free periods."""
        day = {item.period: item for item in self.day(member_id, weekday)}
        for period in self.periods:
            if period.start_minutes <= minutes:
                continue
            if lesson := day.get(period.index):
                return lesson, period
        return None

    def boundaries(self) -> list[int]:
        """Every minute of the day at which a lesson starts or ends, sorted.

        These are the only moments a member sensor can change on its own, so they are
        also the only moments worth waking up for.
        """
        marks = {period.start_minutes for period in self.periods}
        marks.update(period.end_minutes for period in self.periods)
        return sorted(marks)

    @property
    def is_empty(self) -> bool:
        """True when there is nothing to draw."""
        return not self.periods or not any(self.lessons.values())

    def as_card_dict(
        self, extra_subjects: Iterable[str] = (), cycle_weeks: int = 1
    ) -> dict[str, Any]:
        """The grid every timetable card shares: periods, breaks and subject colours.

        The lessons themselves ride on the member sensors instead, which keeps both
        sets of attributes small no matter how big the family gets.

        `extra_subjects` covers the ones that appear nowhere in the week — a subject
        covering a single period on a single date. Without them that lesson is the one
        thing on the card with no colour at all, which reads as broken rather than as
        unusual.
        """
        names = sorted({*self.subjects, *extra_subjects}, key=str.casefold)
        return {
            "periods": [period.as_card_dict() for period in self.periods],
            "breaks": self.breaks,
            "subjects": {subject: self.color(subject) for subject in names},
            # Published rather than inferred. A card could guess the cycle from whether
            # the outlook holds two weeks, but the window is sometimes only seven days
            # long — and on that Monday every A/B household would look like a one-week
            # one, which is exactly the day the marking matters.
            "cycle_weeks": cycle_weeks,
        }

    def member_card_dict(self, member_id: str) -> dict[str, list[dict[str, Any]]]:
        """One member's week, in the shape their sensor publishes."""
        return {
            str(weekday): [lesson.as_card_dict() for lesson in day]
            for weekday, day in sorted(self.week(member_id).items())
        }


@dataclass(slots=True)
class DayException:
    """What one particular date does differently from the week it belongs to.

    Either the whole day is taken over — a trip, a sports day — or individual periods
    are. A period that maps to ``None`` is cancelled; one that maps to a lesson is
    replaced. A period not mentioned at all runs exactly as the timetable says, which
    is what keeps this a thin layer rather than a second timetable.

    A day-level label *is* the day being taken over; there is no separate flag saying
    so. "Wandertag" and "the timetable still applies" is not a combination anybody
    means, and a flag with only one useful position is a question not worth asking.
    """

    label: str | None = None
    #: period -> the replacement lesson, or None when the period is cancelled.
    periods: dict[int, Lesson | None] = field(default_factory=dict)

    @classmethod
    def from_dict(cls, data: dict[str, Any] | None) -> DayException:
        """Build from the stored shape."""
        raw = data or {}
        periods: dict[int, Lesson | None] = {}
        for key, entry in (raw.get(CONF_PERIODS) or {}).items():
            try:
                period = int(key)
            except (TypeError, ValueError):
                continue
            subject = str((entry or {}).get("subject") or "").strip()
            if not subject:
                periods[period] = None
                continue
            room = str((entry or {}).get("room") or "").strip() or None
            periods[period] = Lesson(period=period, subject=subject, room=room)
        return cls(
            label=str(raw.get(CONF_LABEL) or "").strip() or None,
            periods=periods,
        )

    def as_options(self) -> dict[str, Any]:
        """The stored shape."""
        return {
            CONF_LABEL: self.label,
            CONF_PERIODS: {
                str(period): (
                    {"subject": lesson.subject, "room": lesson.room} if lesson else {}
                )
                for period, lesson in sorted(self.periods.items())
            },
        }

    @property
    def closed(self) -> bool:
        """True when the whole day is taken over, which a label is what says."""
        return self.label is not None

    @property
    def is_empty(self) -> bool:
        """True when this exception says nothing and should not be stored."""
        return not self.label and not self.periods

    def as_changes(self) -> dict[str, Any]:
        """The period changes, in the shape the cards read off the outlook."""
        return {
            str(period): (lesson.as_card_dict() if lesson else None)
            for period, lesson in sorted(self.periods.items())
        }

    def applied_to(self, lessons: list[Lesson]) -> list[Lesson]:
        """This day's lessons, once the exception has had its say."""
        if self.closed:
            return []
        by_period = {lesson.period: lesson for lesson in lessons}
        for period, replacement in self.periods.items():
            if replacement is None:
                by_period.pop(period, None)
            else:
                by_period[period] = replacement
        return [by_period[period] for period in sorted(by_period)]


@dataclass(slots=True)
class SchooldayConfig:
    """The full Schoolday configuration."""

    members: list[Member] = field(default_factory=list)
    #: Calendars whose events mean there is no school today.
    school_calendars: list[str] = field(default_factory=list)
    #: What an event has to say for the day to count as holiday care. Empty means
    #: nothing does: no keywords, no care days.
    care_keywords: list[str] = field(default_factory=list)
    #: member id -> block -> Routine
    routines: dict[str, dict[str, Routine]] = field(default_factory=dict)
    timetable: Timetable = field(default_factory=Timetable)
    #: subject -> what it needs brought along, in the order it should be packed.
    materials: dict[str, list[str]] = field(default_factory=dict)
    #: member id -> "YYYY-MM-DD" -> what that date does differently.
    exceptions: dict[str, dict[str, DayException]] = field(default_factory=dict)
    #: How many weeks the timetable takes to repeat: 1, or 2 for an A/B school.
    cycle_weeks: int = 1
    #: The Monday of a week that is week A. None means "this week", settled on read.
    cycle_anchor: date | None = None

    @classmethod
    def from_options(cls, options: dict[str, Any]) -> SchooldayConfig:
        """Build the configuration from a config entry's options."""
        raw_members = options.get(CONF_MEMBERS) or []
        members = [Member.from_dict(item, index) for index, item in enumerate(raw_members)]
        members.sort(key=lambda member: (member.order, member.name))

        raw_routines = options.get(CONF_ROUTINES) or {}
        routines = {
            member.id: {
                block: Routine.from_dict((raw_routines.get(member.id) or {}).get(block))
                for block in ROUTINE_BLOCKS
            }
            for member in members
        }

        materials: dict[str, list[str]] = {}
        for subject, items in (options.get(CONF_MATERIALS) or {}).items():
            cleaned = [item for raw in (items or []) if (item := str(raw).strip())]
            if cleaned and (name := str(subject).strip()):
                materials[name] = cleaned

        try:
            cycle_weeks = int(options.get(CONF_CYCLE_WEEKS) or 1)
        except (TypeError, ValueError):
            cycle_weeks = 1
        cycle_weeks = min(max(cycle_weeks, 1), CYCLE_MAX_WEEKS)

        anchor: date | None = None
        if raw_anchor := options.get(CONF_CYCLE_ANCHOR):
            try:
                parsed = date.fromisoformat(str(raw_anchor))
            except ValueError:
                parsed = None
            if parsed is not None:
                # Stored as whatever day somebody picked; only its Monday matters.
                anchor = parsed - timedelta(days=parsed.weekday())

        exceptions: dict[str, dict[str, DayException]] = {}
        for member_id, dates in (options.get(CONF_EXCEPTIONS) or {}).items():
            per_date = {
                str(day): parsed
                for day, entry in (dates or {}).items()
                if not (parsed := DayException.from_dict(entry)).is_empty
            }
            if per_date:
                exceptions[str(member_id)] = per_date

        return cls(
            members=members,
            school_calendars=list(options.get(CONF_SCHOOL_CALENDARS) or []),
            care_keywords=[
                keyword
                for raw in (options.get(CONF_CARE_KEYWORDS) or [])
                if (keyword := str(raw).strip())
            ],
            routines=routines,
            timetable=Timetable.from_dict(options.get(CONF_TIMETABLE)),
            materials=materials,
            exceptions=exceptions,
            cycle_weeks=cycle_weeks,
            cycle_anchor=anchor,
        )

    def week_index(self, day: date) -> int:
        """Which week of the cycle a date falls in: 0 for A, 1 for B.

        Counted from the anchor Monday rather than from the ISO week number. Week 53
        and the turn of the year make ISO parity jump, and a timetable that swaps
        itself over the Christmas holidays would be a fine bug to explain in February.

        With no cycle, everything is week A — so callers never have to ask first.
        """
        if self.cycle_weeks < 2 or self.cycle_anchor is None:
            return 0
        monday = day - timedelta(days=day.weekday())
        return ((monday - self.cycle_anchor).days // SLOTS_PER_WEEK) % self.cycle_weeks

    def slot_for(self, day: date) -> int:
        """The timetable slot a date lands on: weekday, plus seven for week B."""
        return day.weekday() + SLOTS_PER_WEEK * self.week_index(day)

    @property
    def exception_subjects(self) -> set[str]:
        """Subjects that only ever appear as a replacement on one date."""
        return {
            lesson.subject
            for dates in self.exceptions.values()
            for change in dates.values()
            for lesson in change.periods.values()
            if lesson is not None
        }

    def exception(self, member_id: str, day: date) -> DayException | None:
        """What this member's date does differently, if anything."""
        return (self.exceptions.get(member_id) or {}).get(day.isoformat())

    def lessons_on(self, member_id: str, day: date) -> list[Lesson]:
        """This member's lessons on one dated day, exception and all.

        The one function everything asks. A weekday says what a Tuesday is usually
        like; only a date knows whether this Tuesday's third period was cancelled, and
        the two answers must never be worked out in two places.
        """
        lessons = self.timetable.day(member_id, self.slot_for(day))
        change = self.exception(member_id, day)
        return change.applied_to(lessons) if change else list(lessons)

    def packing_list(self, subjects: Iterable[str]) -> list[tuple[str, str]]:
        """What a day of these subjects needs packed, as (item, subject) pairs.

        Matched case-insensitively, because the subject spelling is only settled
        within one member's week — the materials are typed somewhere else entirely and
        should not have to match keystroke for keystroke.

        An item asked for by two subjects is listed once, under the first: a swimming
        day that also has PE needs one towel, not two, and a child ticking it off twice
        would rightly stop trusting the list.
        """
        by_name = {name.casefold(): items for name, items in self.materials.items()}
        packing: list[tuple[str, str]] = []
        seen: set[str] = set()
        for subject in subjects:
            for item in by_name.get(subject.casefold(), []):
                if (key := item.casefold()) not in seen:
                    seen.add(key)
                    packing.append((item, subject))
        return packing

    def routine(self, member_id: str, block: str) -> Routine:
        """A member's routine for a block, empty when never configured."""
        return (self.routines.get(member_id) or {}).get(block) or Routine()

    def member_by_id(self, member_id: str) -> Member | None:
        """Look up a member by id."""
        return next((m for m in self.members if m.id == member_id), None)

    def as_admin_dict(self) -> dict[str, Any]:
        """Everything the options flow can change, for a card that offers the same.

        Kept apart from the display attributes rather than folded into them: the
        timetable and routine cards are on the wall all day and should not carry the
        weight of settings nobody is looking at.
        """
        return {
            "members": [member.as_admin_dict() for member in self.members],
            "routines": {
                member.id: {
                    block: self.routine(member.id, block).as_admin_dict()
                    for block in ROUTINE_BLOCKS
                }
                for member in self.members
            },
            "periods": [f"{p.start}-{p.end}" for p in self.timetable.periods],
            "colors": dict(self.timetable.colors),
            "school_calendars": list(self.school_calendars),
            "care_keywords": list(self.care_keywords),
            "materials": {name: list(items) for name, items in self.materials.items()},
            "cycle_weeks": self.cycle_weeks,
            "cycle_anchor": self.cycle_anchor.isoformat() if self.cycle_anchor else None,
            # Which week the household is in right now, so the editor can open on it
            # rather than making somebody work it out from a date.
            "cycle_now": self.week_index(date.today()),
            # Every subject in use, so the materials editor can offer them instead of
            # asking the household to type a subject name that has to match exactly.
            "subjects": self.timetable.subjects,
        }

    def member_by_name(self, name: str) -> Member | None:
        """Look up a member by name, case-insensitively."""
        wanted = name.strip().casefold()
        return next((m for m in self.members if m.name.casefold() == wanted), None)

    @property
    def has_timetable(self) -> bool:
        """True when there is a lesson grid with at least one lesson in it."""
        return not self.timetable.is_empty

    @property
    def has_routines(self) -> bool:
        """True when at least one member has at least one step configured."""
        return any(
            not routine.is_empty
            for blocks in self.routines.values()
            for routine in blocks.values()
        )
