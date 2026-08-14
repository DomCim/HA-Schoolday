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

from datetime import date, timedelta
from typing import Any

from homeassistant.util.ulid import ulid_now

from .const import (
    CONF_AVATAR,
    CONF_CALENDAR,
    CONF_CARE_KEYWORDS,
    CONF_COLOR,
    CONF_CYCLE_ANCHOR,
    CONF_CYCLE_WEEKS,
    CONF_EXCEPTIONS,
    CONF_MATERIALS,
    CONF_MEMBER_ID,
    CONF_MEMBERS,
    CONF_NAME,
    CONF_ORDER,
    CONF_ROUTINES,
    CONF_SCHEDULE,
    CONF_SCHOOL_CALENDARS,
    SCHEDULE_NAME_MAX,
    CONF_TIMETABLE,
    CYCLE_MAX_WEEKS,
    ROUTINE_BLOCKS,
    ROUTINE_EXTRA_KEYS,
    SLOTS_PER_WEEK,
    WEEKDAYS,
)
from .models import (
    DayException,
    InvalidPeriod,
    Lesson,
    Timetable,
    color_to_hex,
    periods_from_text,
    unify_subjects,
)
# Aliased: several functions here take a `today` argument so tests can pin the date,
# and the import would shadow it.
from .models import today as _today


class SchooldayValueError(ValueError):
    """A value a card offered that the configuration will not take."""


def _timetable(options: dict[str, Any]) -> Timetable:
    return Timetable.from_dict(options.get(CONF_TIMETABLE))


def _members(options: dict[str, Any]) -> list[dict[str, Any]]:
    return [dict(member) for member in (options.get(CONF_MEMBERS) or [])]


def set_periods(
    options: dict[str, Any], periods: list[str], schedule: str | None = None
) -> dict[str, Any]:
    """Replace the household's lesson times, or one named school's.

    Taken as a list of `HH:MM-HH:MM`, parsed by the same function the options flow
    uses, so an impossible period is refused here exactly as it is refused there.

    With no name this writes the times a member gets when nothing else is said. With
    one it writes that school's, and an empty list removes it -- which is the only way
    a schedule goes away, and deliberately leaves the children who pointed at it on the
    household's times rather than on none.
    """
    timetable = _timetable(options)
    try:
        parsed = periods_from_text("\n".join(periods))
    except InvalidPeriod as err:
        raise SchooldayValueError(
            f"'{err.line}' is not a lesson time. Write it as HH:MM-HH:MM, for example 08:00-08:45."
        ) from err

    if schedule is None:
        timetable.periods = parsed
        return {CONF_TIMETABLE: timetable.as_options()}

    name = _schedule_name(schedule)
    if parsed:
        timetable.schedules[name] = parsed
    else:
        timetable.schedules.pop(name, None)
    return {CONF_TIMETABLE: timetable.as_options()}


def _schedule_name(schedule: str) -> str:
    """Check a schedule name, and hand back the form it is stored under.

    Trimmed rather than taken literally, because "Gymnasium " and "Gymnasium" are one
    school and two entries would be a dropdown with the same word in it twice.
    """
    name = str(schedule).strip()
    if not name:
        raise SchooldayValueError("A set of lesson times needs a name.")
    if len(name) > SCHEDULE_NAME_MAX:
        raise SchooldayValueError(
            f"'{name}' is too long for a name. Keep it under {SCHEDULE_NAME_MAX} characters."
        )
    return name


def _slot(weekday: int, week: int) -> int:
    """The stored slot for a weekday in a week of the cycle.

    Raises rather than clamping: a card that sends week 3 has a bug, and writing it
    into week B would hide that behind a timetable nobody can explain.
    """
    if not 0 <= weekday <= 6:
        raise SchooldayValueError(f"{weekday} is not a weekday. Use 0 for Monday to 6 for Sunday.")
    if not 0 <= week < CYCLE_MAX_WEEKS:
        raise SchooldayValueError(
            f"{week} is not a week of the cycle. Use 0 for week A or 1 for week B."
        )
    return weekday + SLOTS_PER_WEEK * week


def set_lesson(
    options: dict[str, Any],
    member_id: str,
    weekday: int,
    period: int,
    subject: str | None,
    room: str | None = None,
    week: int = 0,
) -> dict[str, Any]:
    """Put one lesson in one period of one day, or clear it.

    One cell at a time, because that is what tapping a cell means. An empty subject
    clears it rather than writing a nameless lesson.

    `week` is 0 for week A and 1 for week B, and is accepted whether or not the
    two-week cycle is switched on — so turning it off and on again does not lose the
    B week somebody already typed.
    """
    timetable = _timetable(options)
    slot = _slot(weekday, week)
    if not any(item.index == period for item in timetable.periods):
        known = ", ".join(str(item.index) for item in timetable.periods) or "none configured"
        raise SchooldayValueError(
            f"There is no period {period}. Configured periods: {known}."
        )

    cycle = {existing: list(lessons) for existing, lessons in timetable.week(member_id).items()}
    day = [lesson for lesson in cycle.get(slot, []) if lesson.period != period]
    if subject := (subject or "").strip():
        day.append(Lesson(period=period, subject=subject, room=(room or "").strip() or None))
    day.sort(key=lambda lesson: lesson.period)

    if day:
        cycle[slot] = day
    else:
        cycle.pop(slot, None)

    # The same rule the options flow applies when a week is saved: one spelling per
    # subject, so "Sport" and "sport" do not become two subjects with two colours.
    unify_subjects(cycle)
    if cycle:
        timetable.lessons[member_id] = cycle
    else:
        timetable.lessons.pop(member_id, None)
    return {CONF_TIMETABLE: timetable.as_options()}


def set_day(
    options: dict[str, Any],
    member_id: str,
    weekday: int,
    lessons: list[dict[str, Any]],
    week: int = 0,
) -> dict[str, Any]:
    """Replace a whole weekday for one member.

    For pasting a day in one go. Each entry needs a period and a subject; anything
    without a subject is a free period and is simply left out.
    """
    timetable = _timetable(options)
    slot = _slot(weekday, week)
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

    cycle = {existing: list(items) for existing, items in timetable.week(member_id).items()}
    if day:
        cycle[slot] = day
    else:
        cycle.pop(slot, None)
    unify_subjects(cycle)
    if cycle:
        timetable.lessons[member_id] = cycle
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
    schedule: str | None = None,
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
        # Not checked against the schedules that exist: one can be written before the
        # times behind it are, and a name that stands for nothing already reads as the
        # household's own times rather than as an error.
        (CONF_SCHEDULE, (schedule or "").strip() or None),
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


def set_cycle(
    options: dict[str, Any],
    weeks: int,
    anchor: str | None = None,
    iso_week: int | None = None,
    iso_year: int | None = None,
    today: date | None = None,
) -> dict[str, Any]:
    """Say how many weeks the timetable takes to repeat, and where week A starts.

    Where week A starts can be given as a calendar week — which is how a school says
    it, and how the card asks — or as a date, for anything writing this from a script.

    It is *stored* as a date either way, and that is deliberate rather than pedantic.
    A calendar week is only half an answer: ISO years have 52 or 53 weeks, so "A is
    the odd weeks" swaps itself over some new years and not others, and the household
    would find out in February. A Monday is an answer that keeps meaning the same
    thing, and the card turns it back into a week number to show.
    """
    if not 1 <= weeks <= CYCLE_MAX_WEEKS:
        raise SchooldayValueError(
            f"A timetable repeats over 1 or {CYCLE_MAX_WEEKS} weeks, not {weeks}."
        )

    changes: dict[str, Any] = {CONF_CYCLE_WEEKS: weeks}

    if iso_week is not None:
        year = iso_year or (today or _today()).isocalendar().year
        try:
            monday = date.fromisocalendar(year, iso_week, 1)
        except ValueError as err:
            raise SchooldayValueError(
                f"{year} has no calendar week {iso_week}."
            ) from err
        changes[CONF_CYCLE_ANCHOR] = monday.isoformat()
    elif anchor:
        try:
            picked = date.fromisoformat(str(anchor).strip())
        except ValueError as err:
            raise SchooldayValueError(
                f"'{anchor}' is not a date. Write it as YYYY-MM-DD."
            ) from err
        changes[CONF_CYCLE_ANCHOR] = (
            picked - timedelta(days=picked.weekday())
        ).isoformat()
    elif weeks > 1 and not options.get(CONF_CYCLE_ANCHOR):
        # Switching the cycle on without saying where it starts: this week is A, which
        # is the only guess that cannot be wrong today and is one tap to correct.
        start = today or _today()
        changes[CONF_CYCLE_ANCHOR] = (
            start - timedelta(days=start.weekday())
        ).isoformat()

    return changes


def _exceptions(options: dict[str, Any], today: date) -> dict[str, dict[str, Any]]:
    """The stored exceptions, with everything before today dropped.

    Pruned on every write rather than by a scheduled job, because a write is the only
    moment anybody is looking. Without it the options would accumulate every cancelled
    lesson of the school year and become the second timetable this layer exists to
    avoid.
    """
    cutoff = today.isoformat()
    pruned: dict[str, dict[str, Any]] = {}
    for member_id, dates in (options.get(CONF_EXCEPTIONS) or {}).items():
        kept = {
            str(day): dict(entry)
            for day, entry in (dates or {}).items()
            if str(day) >= cutoff
        }
        if kept:
            pruned[str(member_id)] = kept
    return pruned


def _parse_date(value: str) -> date:
    try:
        return date.fromisoformat(str(value).strip())
    except ValueError as err:
        raise SchooldayValueError(
            f"'{value}' is not a date. Write it as YYYY-MM-DD, for example 2026-09-18."
        ) from err


def set_exception(
    options: dict[str, Any],
    member_id: str,
    day: str,
    period: int | None = None,
    subject: str | None = None,
    room: str | None = None,
    cancelled: bool = False,
    label: str | None = None,
    today: date | None = None,
) -> dict[str, Any]:
    """Say what one date does differently from the week it belongs to.

    With a period, this is about that period alone: `cancelled` drops it, a subject
    replaces it, and neither hands it back to the timetable. Without one, it is about
    the whole day: a label takes the day over — "Wandertag" — and an empty one hands
    it back.

    Deliberately not "edit the timetable for that week". A timetable is worth typing
    in once because it repeats; the moment it can be edited per week it stops repeating
    and becomes fifty-two timetables.
    """
    when = _parse_date(day)
    if when < (today or _today()):
        raise SchooldayValueError(
            f"{when.isoformat()} has already been. Exceptions are only kept from today onwards."
        )

    stored = _exceptions(options, today or _today())
    per_member = stored.setdefault(member_id, {})
    entry = DayException.from_dict(per_member.get(when.isoformat()))

    if period is None:
        entry.label = (label or "").strip() or None
    else:
        timetable = _timetable(options)
        if not any(item.index == period for item in timetable.periods):
            known = ", ".join(str(item.index) for item in timetable.periods) or "none configured"
            raise SchooldayValueError(
                f"There is no period {period}. Configured periods: {known}."
            )
        name = (subject or "").strip()
        if cancelled:
            entry.periods[period] = None
        elif name:
            entry.periods[period] = Lesson(
                period=period, subject=name, room=(room or "").strip() or None
            )
        else:
            # Neither cancelled nor replaced: this period goes back to the timetable.
            entry.periods.pop(period, None)

    if entry.is_empty:
        per_member.pop(when.isoformat(), None)
    else:
        per_member[when.isoformat()] = entry.as_options()
    if not per_member:
        stored.pop(member_id, None)
    return {CONF_EXCEPTIONS: stored}


def clear_exception(
    options: dict[str, Any], member_id: str, day: str, today: date | None = None
) -> dict[str, Any]:
    """Drop everything one date said differently, putting the timetable back."""
    when = _parse_date(day)
    stored = _exceptions(options, today or _today())
    per_member = stored.get(member_id) or {}
    per_member.pop(when.isoformat(), None)
    if per_member:
        stored[member_id] = per_member
    else:
        stored.pop(member_id, None)
    return {CONF_EXCEPTIONS: stored}


def set_materials(
    options: dict[str, Any], subject: str, items: list[str]
) -> dict[str, Any]:
    """Say what a subject needs brought along, or stop asking for anything.

    An empty list removes the subject rather than storing an empty one, so a subject
    nobody packs for leaves no trace in the options and no empty row in the editor.

    The subject is not checked against the timetable on purpose: materials may well be
    typed before the week is, and refusing "Schwimmen" because next term has not been
    entered yet would be a rule that only ever gets in the way.
    """
    name = subject.strip()
    if not name:
        raise SchooldayValueError("A subject needs a name.")

    materials = {
        str(key): list(value) for key, value in (options.get(CONF_MATERIALS) or {}).items()
    }
    # Case-insensitively, so "Sport" typed twice edits one entry rather than making a
    # second one the packing list would then read out twice.
    for existing in [key for key in materials if key.casefold() == name.casefold()]:
        del materials[existing]

    if cleaned := [item for raw in items if (item := str(raw).strip())]:
        materials[name] = cleaned
    return {CONF_MATERIALS: materials}


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
