"""Typed view over the config entry options.

The config entry options are the single source of truth for Schoolday's configuration.
This module is the only place that knows their raw shape; everything else works with
:class:`Member` and :class:`SchooldayConfig`.
"""

from __future__ import annotations

import re
from dataclasses import dataclass, field
from typing import Any
from zlib import crc32

from .const import (
    BREAK_MIN_MINUTES,
    CONF_AVATAR,
    CONF_COLOR,
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
    ROUTINE_BLOCKS,
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


@dataclass(slots=True)
class Routine:
    """One member's steps for one block, keyed by weekday (0 = Monday).

    Deliberately independent of the timetable: "pack the PE kit" belongs to the
    evening before, so it is a step on the days that have PE rather than something
    derived from the lesson grid.
    """

    by_weekday: dict[int, list[str]] = field(default_factory=dict)

    @classmethod
    def from_dict(cls, data: dict[str, Any] | None) -> Routine:
        """Build from the stored ``{"0": ["step", ...]}`` shape."""
        by_weekday: dict[int, list[str]] = {}
        for key, steps in (data or {}).items():
            try:
                weekday = int(key)
            except (TypeError, ValueError):
                continue
            if 0 <= weekday <= 6 and steps:
                by_weekday[weekday] = [str(step) for step in steps]
        return cls(by_weekday=by_weekday)

    def steps_for(self, weekday: int) -> list[str]:
        """Steps for a given weekday, empty when nothing is planned."""
        return self.by_weekday.get(weekday, [])

    @property
    def is_empty(self) -> bool:
        """True when no weekday has any step."""
        return not any(self.by_weekday.values())


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
                    weekday = int(day_key)
                except (TypeError, ValueError):
                    continue
                if not 0 <= weekday <= 6:
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
                    days[weekday] = sorted(day, key=lambda lesson: lesson.period)
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
        """One member's week, empty when they have no timetable."""
        return self.lessons.get(member_id, {})

    def day(self, member_id: str, weekday: int) -> list[Lesson]:
        """One member's lessons on one weekday."""
        return self.week(member_id).get(weekday, [])

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

    def as_card_dict(self) -> dict[str, Any]:
        """The grid every timetable card shares: periods, breaks and subject colours.

        The lessons themselves ride on the member sensors instead, which keeps both
        sets of attributes small no matter how big the family gets.
        """
        return {
            "periods": [period.as_card_dict() for period in self.periods],
            "breaks": self.breaks,
            "subjects": {subject: self.color(subject) for subject in self.subjects},
        }

    def member_card_dict(self, member_id: str) -> dict[str, list[dict[str, Any]]]:
        """One member's week, in the shape their sensor publishes."""
        return {
            str(weekday): [lesson.as_card_dict() for lesson in day]
            for weekday, day in sorted(self.week(member_id).items())
        }


@dataclass(slots=True)
class SchooldayConfig:
    """The full Schoolday configuration."""

    members: list[Member] = field(default_factory=list)
    #: Calendars whose events mean there is no school today.
    school_calendars: list[str] = field(default_factory=list)
    #: member id -> block -> Routine
    routines: dict[str, dict[str, Routine]] = field(default_factory=dict)
    timetable: Timetable = field(default_factory=Timetable)

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

        return cls(
            members=members,
            school_calendars=list(options.get(CONF_SCHOOL_CALENDARS) or []),
            routines=routines,
            timetable=Timetable.from_dict(options.get(CONF_TIMETABLE)),
        )

    def routine(self, member_id: str, block: str) -> Routine:
        """A member's routine for a block, empty when never configured."""
        return (self.routines.get(member_id) or {}).get(block) or Routine()

    def member_by_id(self, member_id: str) -> Member | None:
        """Look up a member by id."""
        return next((m for m in self.members if m.id == member_id), None)

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
