"""Writing the Schoolday configuration from somewhere other than the options flow.

A Lovelace card cannot edit a config entry, but it can call a service — so this is
what lets a management card offer what the options dialog offers, without anybody
having to find the integration page.

Everything here goes through the same parsing and the same rules as the options flow:
a card must not be able to write a timetable the sensors can no longer read. Where the
options flow parses a textarea, these take the value already in pieces, because a card
knows which cell was tapped and should not have to render text to say so.

Each function takes the current options and returns the sections it changed. Merging
and writing the config entry is the caller's job, so nothing here needs a `hass`.
"""

from __future__ import annotations

from typing import Any

from homeassistant.util.ulid import ulid_now

from .const import (
    CONF_AVATAR,
    CONF_CALENDAR,
    CONF_CARE_KEYWORDS,
    CONF_COLOR,
    CONF_MEMBER_ID,
    CONF_MEMBERS,
    CONF_NAME,
    CONF_ORDER,
    CONF_ROUTINES,
    CONF_SCHOOL_CALENDARS,
    CONF_TIMETABLE,
    ROUTINE_BLOCKS,
    ROUTINE_EXTRA_KEYS,
    WEEKDAYS,
)
from .models import (
    InvalidPeriod,
    Lesson,
    Timetable,
    color_to_hex,
    periods_from_text,
    unify_subjects,
)


class SchooldayValueError(ValueError):
    """A value a card offered that the configuration will not take."""


def _timetable(options: dict[str, Any]) -> Timetable:
    return Timetable.from_dict(options.get(CONF_TIMETABLE))


def _members(options: dict[str, Any]) -> list[dict[str, Any]]:
    return [dict(member) for member in (options.get(CONF_MEMBERS) or [])]


def set_periods(options: dict[str, Any], periods: list[str]) -> dict[str, Any]:
    """Replace the household's lesson times.

    Taken as a list of `HH:MM-HH:MM`, parsed by the same function the options flow
    uses, so an impossible period is refused here exactly as it is refused there.
    """
    timetable = _timetable(options)
    try:
        timetable.periods = periods_from_text("\n".join(periods))
    except InvalidPeriod as err:
        raise SchooldayValueError(
            f"'{err.line}' is not a lesson time. Write it as HH:MM-HH:MM, for example 08:00-08:45."
        ) from err
    return {CONF_TIMETABLE: timetable.as_options()}


def set_lesson(
    options: dict[str, Any],
    member_id: str,
    weekday: int,
    period: int,
    subject: str | None,
    room: str | None = None,
) -> dict[str, Any]:
    """Put one lesson in one period of one day, or clear it.

    One cell at a time, because that is what tapping a cell means. An empty subject
    clears it rather than writing a nameless lesson.
    """
    timetable = _timetable(options)
    if not 0 <= weekday <= 6:
        raise SchooldayValueError(f"{weekday} is not a weekday. Use 0 for Monday to 6 for Sunday.")
    if not any(item.index == period for item in timetable.periods):
        known = ", ".join(str(item.index) for item in timetable.periods) or "none configured"
        raise SchooldayValueError(
            f"There is no period {period}. Configured periods: {known}."
        )

    week = {day: list(lessons) for day, lessons in timetable.week(member_id).items()}
    day = [lesson for lesson in week.get(weekday, []) if lesson.period != period]
    if subject := (subject or "").strip():
        day.append(Lesson(period=period, subject=subject, room=(room or "").strip() or None))
    day.sort(key=lambda lesson: lesson.period)

    if day:
        week[weekday] = day
    else:
        week.pop(weekday, None)

    # The same rule the options flow applies when a week is saved: one spelling per
    # subject, so "Sport" and "sport" do not become two subjects with two colours.
    unify_subjects(week)
    if week:
        timetable.lessons[member_id] = week
    else:
        timetable.lessons.pop(member_id, None)
    return {CONF_TIMETABLE: timetable.as_options()}


def set_day(
    options: dict[str, Any],
    member_id: str,
    weekday: int,
    lessons: list[dict[str, Any]],
) -> dict[str, Any]:
    """Replace a whole weekday for one member.

    For pasting a day in one go. Each entry needs a period and a subject; anything
    without a subject is a free period and is simply left out.
    """
    timetable = _timetable(options)
    if not 0 <= weekday <= 6:
        raise SchooldayValueError(f"{weekday} is not a weekday. Use 0 for Monday to 6 for Sunday.")
    known = {item.index for item in timetable.periods}

    day: list[Lesson] = []
    for entry in lessons:
        subject = str((entry or {}).get("subject") or "").strip()
        if not subject:
            continue
        try:
            period = int((entry or {}).get("period"))
        except (TypeError, ValueError) as err:
            raise SchooldayValueError(
                f"'{entry}' has no period number. Every lesson needs one."
            ) from err
        if period not in known:
            raise SchooldayValueError(
                f"There is no period {period}. Configured periods: "
                f"{', '.join(str(index) for index in sorted(known)) or 'none configured'}."
            )
        day.append(
            Lesson(
                period=period,
                subject=subject,
                room=str((entry or {}).get("room") or "").strip() or None,
            )
        )
    day.sort(key=lambda lesson: lesson.period)

    week = {existing: list(items) for existing, items in timetable.week(member_id).items()}
    if day:
        week[weekday] = day
    else:
        week.pop(weekday, None)
    unify_subjects(week)
    if week:
        timetable.lessons[member_id] = week
    else:
        timetable.lessons.pop(member_id, None)
    return {CONF_TIMETABLE: timetable.as_options()}


def set_subject_color(options: dict[str, Any], subject: str, color: Any) -> dict[str, Any]:
    """Give one subject a colour, or hand it back its derived one.

    Every subject already has a colour worked out from its name, so clearing one is
    not leaving it blank — it is going back to that.
    """
    timetable = _timetable(options)
    name = subject.strip()
    if not name:
        raise SchooldayValueError("A subject needs a name.")
    if color in (None, ""):
        timetable.colors.pop(name, None)
    elif (hex_value := color_to_hex(color)) is not None:
        timetable.colors[name] = hex_value
    else:
        raise SchooldayValueError(f"'{color}' is not a colour. Use #rrggbb or [r, g, b].")
    return {CONF_TIMETABLE: timetable.as_options()}


def set_routine(
    options: dict[str, Any],
    member_id: str,
    block: str,
    day: str,
    steps: list[str],
) -> dict[str, Any]:
    """Replace one member's steps for one block on one day.

    `day` is a weekday "0".."6", or "free" and "care" for the two kinds of day that
    are not school — a holiday morning is its own short list, not a school morning
    with bits removed.
    """
    if block not in ROUTINE_BLOCKS:
        raise SchooldayValueError(
            f"'{block}' is not a routine block. Use {' or '.join(ROUTINE_BLOCKS)}."
        )
    allowed = (*WEEKDAYS, *ROUTINE_EXTRA_KEYS)
    if day not in allowed:
        raise SchooldayValueError(f"'{day}' is not a routine day. Use one of {', '.join(allowed)}.")

    routines = {
        key: {inner: dict(value) for inner, value in (blocks or {}).items()}
        for key, blocks in (options.get(CONF_ROUTINES) or {}).items()
    }
    member = routines.setdefault(member_id, {})
    current = dict(member.get(block) or {})
    cleaned = [step for raw in steps if (step := str(raw).strip())]
    if cleaned:
        current[day] = cleaned
    else:
        current.pop(day, None)
    member[block] = current
    return {CONF_ROUTINES: routines}


def set_member(
    options: dict[str, Any],
    member_id: str | None,
    name: str,
    color: Any = None,
    calendar: str | None = None,
    avatar: str | None = None,
) -> tuple[dict[str, Any], str]:
    """Add a family member, or change one that exists.

    Returns the changed section and the member's id, so a caller adding somebody can
    say who was added. Omitted fields are cleared rather than kept: a card that sends
    a whole member form has already decided what should be there.
    """
    members = _members(options)
    label = name.strip()
    if not label:
        raise SchooldayValueError("A family member needs a name.")

    hex_color = color_to_hex(color) if color not in (None, "") else None
    if color not in (None, "") and hex_color is None:
        raise SchooldayValueError(f"'{color}' is not a colour. Use #rrggbb or [r, g, b].")

    existing = next((item for item in members if item.get(CONF_MEMBER_ID) == member_id), None)
    if member_id is not None and existing is None:
        raise SchooldayValueError(f"No family member has the id '{member_id}'.")

    if existing is None:
        # Mirrors the options flow: a new member goes on the end and keeps that place.
        new_id = ulid_now()
        entry: dict[str, Any] = {CONF_MEMBER_ID: new_id, CONF_ORDER: len(members)}
        members.append(entry)
    else:
        entry = existing
        new_id = str(entry[CONF_MEMBER_ID])

    entry[CONF_NAME] = label
    for key, value in (
        (CONF_COLOR, hex_color),
        (CONF_CALENDAR, (calendar or "").strip() or None),
        (CONF_AVATAR, (avatar or "").strip() or None),
    ):
        if value:
            entry[key] = value
        else:
            entry.pop(key, None)

    return {CONF_MEMBERS: members}, new_id


def remove_member(options: dict[str, Any], member_id: str) -> dict[str, Any]:
    """Remove a family member, and everything that only existed for them."""
    members = _members(options)
    if not any(item.get(CONF_MEMBER_ID) == member_id for item in members):
        raise SchooldayValueError(f"No family member has the id '{member_id}'.")

    remaining = [item for item in members if item.get(CONF_MEMBER_ID) != member_id]
    for order, item in enumerate(remaining):
        item[CONF_ORDER] = order

    routines = {
        key: value
        for key, value in (options.get(CONF_ROUTINES) or {}).items()
        if key != member_id
    }
    timetable = _timetable(options)
    timetable.lessons.pop(member_id, None)
    return {
        CONF_MEMBERS: remaining,
        CONF_ROUTINES: routines,
        CONF_TIMETABLE: timetable.as_options(),
    }


def set_calendars(
    options: dict[str, Any],
    school_calendars: list[str] | None,
    care_keywords: list[str] | None,
) -> dict[str, Any]:
    """Name the calendars that close the school, and the words that mean holiday care.

    Passing nothing for either leaves it alone, so a card can offer one without
    having to resend the other.
    """
    changes: dict[str, Any] = {}
    if school_calendars is not None:
        cleaned = [entity for raw in school_calendars if (entity := str(raw).strip())]
        for entity in cleaned:
            if not entity.startswith("calendar."):
                raise SchooldayValueError(
                    f"'{entity}' is not a calendar. Every entry has to be a calendar entity."
                )
        changes[CONF_SCHOOL_CALENDARS] = cleaned
    if care_keywords is not None:
        changes[CONF_CARE_KEYWORDS] = [
            keyword for raw in care_keywords if (keyword := str(raw).strip())
        ]
    return changes
