"""Sensors that expose the Schoolday configuration to the cards and to automations.

There is deliberately no coordinator and no polling. The routine ticks arrive over a
dispatcher signal, and the only thing that changes on its own is which lesson is
running — which happens at times the timetable already knows, so the member sensors
wake up exactly at those and sleep in between.
"""

from __future__ import annotations

import logging
from collections.abc import Iterable, Mapping
from datetime import date, datetime, time, timedelta
from typing import Any

from homeassistant.components.sensor import SensorEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, callback
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers.device_registry import DeviceEntryType, DeviceInfo
from homeassistant.helpers.dispatcher import async_dispatcher_connect
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback
from homeassistant.helpers.event import (
    async_track_point_in_time,
    async_track_state_change_event,
)
from homeassistant.util import dt as dt_util

from .const import (
    ATTR_ADMIN,
    ATTR_AVATAR,
    ATTR_BOARD,
    ATTR_CHANGES,
    ATTR_COLOR,
    ATTR_DATE,
    ATTR_DAY_MODE,
    ATTR_FROM_SUBJECT,
    ATTR_LABEL,
    ATTR_LESSON_NEXT,
    ATTR_LESSON_NOW,
    ATTR_MEMBER,
    ATTR_MEMBER_ID,
    ATTR_MEMBERS,
    ATTR_MODE,
    ATTR_NO_SCHOOL,
    ATTR_OUTLOOK,
    ATTR_PERIOD,
    ATTR_ROOM,
    ATTR_ROUTINE_BLOCKS,
    ATTR_ROUTINE_EVENING,
    ATTR_ROUTINE_MORNING,
    ATTR_SCHOOL_TODAY,
    ATTR_SICK_UNTIL,
    ATTR_SUBJECT,
    ATTR_TIMETABLE,
    ATTR_TODAY,
    ATTR_TODAY_SUBJECTS,
    ATTR_TODAY_SUMMARY,
    ATTR_VERSION,
    ATTR_WEEK,
    ATTR_WEEKDAY,
    BLOCK_EVENING,
    BLOCK_MORNING,
    DATA_ABSENCE,
    DATA_STORE,
    DOMAIN,
    EVENT_LESSON_ENDED,
    EVENT_LESSON_STARTED,
    MODE_CARE,
    MODE_EVENT,
    MODE_FREE,
    MODE_SCHOOL,
    MODE_SICK,
    OUTLOOK_DAYS,
    ROUTINE_BLOCKS,
    SIGNAL_ABSENCE_UPDATED,
    SIGNAL_ROUTINE_UPDATED,
    STATE_FREE,
    VERSION,
)
from .models import Lesson, Member, Period, SchooldayConfig
from .store import AbsenceStore, RoutineStore

_LOGGER = logging.getLogger(__name__)


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    """Set up the Schoolday sensors."""
    config = SchooldayConfig.from_options(entry.options)
    _async_remove_orphans(hass, entry, config)

    store: RoutineStore = hass.data[DATA_STORE]
    absence: AbsenceStore = hass.data[DATA_ABSENCE]
    async_add_entities(
        [
            SchooldayBoardSensor(entry, config),
            *(
                SchooldayMemberSensor(entry, member, config, store, absence)
                for member in config.members
            ),
        ]
    )


@callback
def _async_remove_orphans(
    hass: HomeAssistant, entry: ConfigEntry, config: SchooldayConfig
) -> None:
    """Drop registry entries for members that no longer exist.

    Every unique id Schoolday can produce has to be listed here, not just the sensors:
    this sweeps the whole config entry, so a platform left out would have its entities
    deleted the moment they were created.
    """
    registry = er.async_get(hass)
    expected = {
        _board_unique_id(entry),
        *(_member_unique_id(entry, member.id) for member in config.members),
        *(sick_unique_id(entry, member.id) for member in config.members),
        *(homework_unique_id(entry, member.id) for member in config.members),
    }
    for registry_entry in er.async_entries_for_config_entry(registry, entry.entry_id):
        if registry_entry.unique_id not in expected:
            registry.async_remove(registry_entry.entity_id)


def _board_unique_id(entry: ConfigEntry) -> str:
    return f"{entry.entry_id}_board"


def _member_unique_id(entry: ConfigEntry, member_id: str) -> str:
    return f"{entry.entry_id}_{member_id}"


def sick_unique_id(entry: ConfigEntry, member_id: str) -> str:
    """The ill-today switch's unique id. Public because two platforms need to agree."""
    return f"{entry.entry_id}_{member_id}_sick"


def homework_unique_id(entry: ConfigEntry, member_id: str) -> str:
    """The homework list's unique id, for the same reason as above."""
    return f"{entry.entry_id}_{member_id}_homework"


def _device_info(entry: ConfigEntry) -> DeviceInfo:
    """Group every Schoolday entity under one service device."""
    return DeviceInfo(
        identifiers={(DOMAIN, entry.entry_id)},
        name="Schoolday",
        manufacturer="Schoolday",
        model="Timetable and routines",
        entry_type=DeviceEntryType.SERVICE,
        sw_version=VERSION,
    )


def _no_school_reason(hass: HomeAssistant, config: SchooldayConfig) -> str | None:
    """What is keeping school shut right now, or None when it is a normal day.

    A calendar entity is `on` while one of its events is running, and a holiday is an
    all-day event, so the entity state answers this without a single API call. The
    contract is deliberately blunt — any event on these calendars closes the school —
    which is why the option asks for calendars that hold nothing but days off.
    """
    for entity_id in config.school_calendars:
        state = hass.states.get(entity_id)
        if state is None or state.state != "on":
            continue
        return (
            state.attributes.get("message")
            or state.attributes.get("friendly_name")
            or entity_id
        )
    return None


def _event_days(event: Mapping[str, Any]) -> Iterable[date]:
    """Every date an event actually runs on.

    Two conventions meet here and both end a day early if taken literally. An all-day
    event ends on the morning it is over, so a holiday `2026-08-03` to `2026-09-15`
    runs through the 14th. A timed event that ends at midnight belongs to the day
    before, not to the one it brushes. Getting either wrong shows a holiday on the
    first day back.
    """
    raw_start = str(event.get("start") or "")
    raw_end = str(event.get("end") or "")
    if not raw_start:
        return ()

    if (start_at := dt_util.parse_datetime(raw_start)) is not None:
        first = dt_util.as_local(start_at).date()
        end_at = dt_util.parse_datetime(raw_end) if raw_end else None
        if end_at is None:
            last = first
        else:
            ends = dt_util.as_local(end_at)
            last = ends.date()
            if ends.time() == time.min and last > first:
                last -= timedelta(days=1)
    else:
        first = dt_util.parse_date(raw_start)
        if first is None:
            return ()
        end_on = dt_util.parse_date(raw_end) if raw_end else None
        last = end_on - timedelta(days=1) if end_on else first

    if last < first:
        last = first
    return (first + timedelta(days=offset) for offset in range((last - first).days + 1))


def _lesson_dict(lesson: Lesson, period: Period) -> dict[str, Any]:
    """One lesson, in the shape both the attributes and the events use."""
    return {
        ATTR_SUBJECT: lesson.subject,
        ATTR_ROOM: lesson.room,
        ATTR_PERIOD: period.index,
        "start": period.start,
        "end": period.end,
    }


class SchooldayBaseSensor(SensorEntity):
    """Shared plumbing for Schoolday's sensors."""

    _attr_has_entity_name = True
    _attr_should_poll = False

    def __init__(self, entry: ConfigEntry) -> None:
        """Attach the entity to the Schoolday service device."""
        self._attr_device_info = _device_info(entry)


class SchooldayBoardSensor(SchooldayBaseSensor):
    """One entity carrying the whole family setup, for the cards to read.

    The cards read this instead of being configured with member lists of their own, so
    changing a colour in the options flow updates every card at once.
    """

    _attr_icon = "mdi:timetable"
    _attr_translation_key = "board"

    def __init__(self, entry: ConfigEntry, config: SchooldayConfig) -> None:
        """Initialise the board sensor."""
        super().__init__(entry)
        self._config = config
        self._attr_unique_id = _board_unique_id(entry)

    async def async_added_to_hass(self) -> None:
        """Follow the holiday calendars, so a holiday starting shows up at once."""
        if calendars := self._config.school_calendars:
            self.async_on_remove(
                async_track_state_change_event(
                    self.hass, calendars, self._handle_change
                )
            )

    @callback
    def _handle_change(self, _event: Any = None) -> None:
        self.async_write_ha_state()

    @property
    def native_value(self) -> int:
        """Number of configured family members."""
        return len(self._config.members)

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        """The full Schoolday configuration."""
        reason = _no_school_reason(self.hass, self._config)
        return {
            ATTR_BOARD: True,
            ATTR_MEMBERS: [member.as_card_dict() for member in self._config.members],
            ATTR_ROUTINE_BLOCKS: list(ROUTINE_BLOCKS),
            # The lesson grid only: each member's own week rides on their sensor, so
            # neither attribute set grows with the size of the family.
            ATTR_TIMETABLE: self._config.timetable.as_card_dict(
                self._config.exception_subjects, self._config.cycle_weeks
            ),
            ATTR_SCHOOL_TODAY: reason is None,
            ATTR_NO_SCHOOL: reason,
            # What the management card edits. Only it reads this; the display cards
            # take their smaller shapes above.
            ATTR_ADMIN: self._config.as_admin_dict(),
            ATTR_VERSION: VERSION,
        }


class SchooldayMemberSensor(SchooldayBaseSensor):
    """One family member: the lesson they are in as the state, their day as attributes.

    The state is the subject rather than a number so that the obvious automation is the
    one that works — trigger on this entity going to `Sport`.
    """

    _attr_icon = "mdi:account-school"

    def __init__(
        self,
        entry: ConfigEntry,
        member: Member,
        config: SchooldayConfig,
        store: RoutineStore,
        absence: AbsenceStore,
    ) -> None:
        """Initialise a member sensor."""
        super().__init__(entry)
        self._member = member
        self._config = config
        self._store = store
        self._absence = absence
        self._attr_name = member.name
        self._attr_unique_id = _member_unique_id(entry, member.id)
        #: The lesson considered running, so a boundary knows what just ended.
        self._running: dict[str, Any] | None = None
        self._unsub_boundary: Any = None
        #: This week and the next seven days, in date order, and the day built for.
        self._outlook: list[dict[str, Any]] = []
        self._outlook_date: date | None = None

    async def async_added_to_hass(self) -> None:
        """Follow the routine ticks and the holidays, and wake at the next boundary."""
        self.async_on_remove(
            async_dispatcher_connect(
                self.hass, SIGNAL_ROUTINE_UPDATED, self._handle_change
            )
        )
        # An absence closes the day the moment it is switched on, which has to end the
        # lesson that was running — so it goes through the boundary logic, not straight
        # to the state, exactly as a holiday appearing mid-morning does.
        self.async_on_remove(
            async_dispatcher_connect(
                self.hass, SIGNAL_ABSENCE_UPDATED, self._handle_absence_change
            )
        )
        watched = [*self._config.school_calendars]
        if self._member.calendar:
            watched.append(self._member.calendar)
        if watched:
            self.async_on_remove(
                async_track_state_change_event(
                    self.hass, watched, self._handle_calendar_change
                )
            )

        await self._async_refresh_outlook()
        # Adopt whatever is running without announcing it: Home Assistant restarting
        # mid-morning must not fire "PE has started" into the kitchen.
        self._running = self._lesson_now()
        self._schedule_boundary()
        self.async_on_remove(self._cancel_boundary)

    # --- timetable ----------------------------------------------------------

    @staticmethod
    def _now() -> tuple[int, int]:
        """Today as (weekday, minutes since midnight), in Home Assistant's zone."""
        now = dt_util.now()
        return now.weekday(), now.hour * 60 + now.minute

    async def _async_read_events(
        self, entity_ids: list[str], start: datetime, end: datetime
    ) -> dict[str, list[Mapping[str, Any]]]:
        """Fetch a window from several calendars in one call.

        The whole window is fetched rather than read off the calendar entities' states:
        a state only ever describes what is running right now, and this has to answer
        for days that have not happened yet.
        """
        if not entity_ids:
            return {}
        try:
            response = await self.hass.services.async_call(
                "calendar",
                "get_events",
                {
                    "start_date_time": start.isoformat(),
                    "end_date_time": end.isoformat(),
                },
                target={"entity_id": entity_ids},
                blocking=True,
                return_response=True,
            )
        except HomeAssistantError as err:
            # A calendar that has gone away must not take the sensor with it.
            _LOGGER.warning(
                "Could not read %s for %s: %s",
                ", ".join(entity_ids),
                self._member.name,
                err,
            )
            return {}
        return {
            entity_id: (data or {}).get("events") or []
            for entity_id, data in (response or {}).items()
        }

    async def _async_refresh_outlook(self) -> None:
        """Work out what each day of this week and the next seven days holds.

        The window starts at Monday of the current week rather than at today, so a card
        can show either the week as it stands or the days still to come. That means a
        weekday can appear twice — this Tuesday and next — which is why this is a list
        of dates and not a map keyed by weekday: only the card knows which it wants.
        """
        today = dt_util.now().date()
        self._outlook_date = today
        first = today - timedelta(days=today.weekday())
        last = today + timedelta(days=OUTLOOK_DAYS - 1)
        days = [
            first + timedelta(days=offset) for offset in range((last - first).days + 1)
        ]
        entries: dict[date, dict[str, Any]] = {
            day: {
                ATTR_DATE: day.isoformat(),
                ATTR_WEEKDAY: day.weekday(),
                ATTR_MODE: MODE_SCHOOL,
                ATTR_LABEL: None,
                ATTR_WEEK: self._config.week_index(day),
            }
            for day in days
        }

        start = dt_util.start_of_local_day(first)
        end = dt_util.start_of_local_day(last) + timedelta(days=1)
        calendars = list(self._config.school_calendars)
        if self._member.calendar and self._member.calendar not in calendars:
            calendars.append(self._member.calendar)
        events = await self._async_read_events(calendars, start, end)

        # Holidays first: any event on these calendars closes the school, which is why
        # the option asks for calendars that hold nothing else.
        for entity_id in self._config.school_calendars:
            for event in events.get(entity_id, []):
                summary = str(event.get("summary") or "").strip() or None
                for day in _event_days(event):
                    entry = entries.get(day)
                    if entry is not None and entry[ATTR_MODE] == MODE_SCHOOL:
                        entry[ATTR_MODE] = MODE_FREE
                        entry[ATTR_LABEL] = summary

        # Then care, which wins over a plain holiday: a child in holiday care is not at
        # home. Matched on the member's own calendar, which also holds the dentist and
        # football, so only the household's own keywords count.
        keywords = [keyword.casefold() for keyword in self._config.care_keywords]
        if keywords and self._member.calendar:
            for event in events.get(self._member.calendar, []):
                summary = str(event.get("summary") or "").strip()
                if not any(keyword in summary.casefold() for keyword in keywords):
                    continue
                for day in _event_days(event):
                    entry = entries.get(day)
                    if entry is not None:
                        entry[ATTR_MODE] = MODE_CARE
                        entry[ATTR_LABEL] = summary or None

        # Last, what the household said about this one date. Only where the day is
        # still a school day: the calendars answer whether school happens at all, and
        # a trip cannot take place during the summer holidays.
        for day in days:
            change = self._config.exception(self._member.id, day)
            if change is None:
                continue
            entry = entries[day]
            if change.closed and entry[ATTR_MODE] == MODE_SCHOOL:
                entry[ATTR_MODE] = MODE_EVENT
                entry[ATTR_LABEL] = change.label
            if change.periods:
                entry[ATTR_CHANGES] = change.as_changes()

        self._outlook = [entries[day] for day in days]

    @property
    def _published_outlook(self) -> list[dict[str, Any]]:
        """The outlook with this member's illness laid over it.

        Kept apart from the calendar-driven outlook rather than written into it: the
        calendars answer what the school is doing, the absence answers what this child
        is doing, and only one of the two survives a reload of the other. Overlaying at
        the last moment is also what makes the switch feel instant — nothing has to be
        fetched again.
        """
        until = self._absence.until(self._member.id)
        if until is None:
            return self._outlook
        first = dt_util.now().date()
        return [
            {**entry, ATTR_MODE: MODE_SICK, ATTR_LABEL: None}
            if first.isoformat() <= str(entry[ATTR_DATE]) <= until.isoformat()
            else entry
            for entry in self._outlook
        ]

    @property
    def _day_mode(self) -> str:
        """What kind of day today is for this member.

        Read out of the outlook rather than worked out again: today is simply the
        first of the seven days, and having one answer keeps the card and the
        announcement from ever disagreeing.
        """
        wanted = dt_util.now().date().isoformat()
        for entry in self._published_outlook:
            if entry[ATTR_DATE] == wanted:
                return str(entry[ATTR_MODE])
        return MODE_SCHOOL

    def _mode_on(self, day: date) -> str:
        """What kind of day a date is for this member, school when it is out of range."""
        wanted = day.isoformat()
        for entry in self._published_outlook:
            if entry[ATTR_DATE] == wanted:
                return str(entry[ATTR_MODE])
        return MODE_SCHOOL

    @property
    def _school_today(self) -> bool:
        return self._day_mode == MODE_SCHOOL

    def _lessons_today(self) -> list[Lesson]:
        """Today's lessons by date, so a cancelled period really is gone.

        Everything below asks this rather than the weekly grid. A weekday says what a
        Tuesday is usually like; only a date knows what this Tuesday holds, and the two
        must never be worked out in two places.
        """
        return self._config.lessons_on(self._member.id, dt_util.now().date())

    def _lesson_now(self) -> dict[str, Any] | None:
        if not self._school_today:
            return None
        _weekday, minutes = self._now()
        period = self._config.timetable.period_at(minutes)
        if period is None:
            return None
        lesson = next(
            (item for item in self._lessons_today() if item.period == period.index), None
        )
        return _lesson_dict(lesson, period) if lesson else None

    def _lesson_next(self) -> dict[str, Any] | None:
        if not self._school_today:
            return None
        _weekday, minutes = self._now()
        day = {lesson.period: lesson for lesson in self._lessons_today()}
        for period in self._config.timetable.periods:
            if period.start_minutes <= minutes:
                continue
            if lesson := day.get(period.index):
                return _lesson_dict(lesson, period)
        return None

    def _today(self) -> list[dict[str, Any]]:
        # On a holiday there is nothing on today — which is what makes the morning
        # announcement fall silent by itself, with no second condition to maintain.
        if not self._school_today:
            return []
        periods = {period.index: period for period in self._config.timetable.periods}
        return [
            _lesson_dict(lesson, periods[lesson.period])
            for lesson in self._lessons_today()
            if lesson.period in periods
        ]

    @callback
    def _cancel_boundary(self) -> None:
        if self._unsub_boundary is not None:
            self._unsub_boundary()
            self._unsub_boundary = None

    @callback
    def _schedule_boundary(self) -> None:
        """Wake up once, at the next moment this sensor can change."""
        self._cancel_boundary()
        now = dt_util.now()
        minutes = now.hour * 60 + now.minute
        upcoming = [
            mark for mark in self._config.timetable.boundaries() if mark > minutes
        ]
        if upcoming:
            when = now.replace(
                hour=upcoming[0] // 60, minute=upcoming[0] % 60, second=0, microsecond=0
            )
        else:
            # Nothing left today: the date itself is the next thing that changes, and
            # a few seconds past midnight keeps this clear of the rollover.
            when = (now + timedelta(days=1)).replace(
                hour=0, minute=0, second=5, microsecond=0
            )
        self._unsub_boundary = async_track_point_in_time(
            self.hass, self._handle_boundary, when
        )

    async def _handle_boundary(self, _now: datetime | None = None) -> None:
        """A lesson started, a lesson ended, or the day rolled over."""
        self._unsub_boundary = None
        # Only the day rolling over moves the seven-day window along.
        if self._outlook_date != dt_util.now().date():
            await self._async_refresh_outlook()
        self._apply_boundary()
        self._schedule_boundary()

    @callback
    def _apply_boundary(self) -> None:
        """Publish the change, announcing what began and what ended."""
        current = self._lesson_now()

        if current != self._running:
            if self._running is not None:
                self._fire(EVENT_LESSON_ENDED, self._running)
            if current is not None:
                self._fire(EVENT_LESSON_STARTED, current)
            self._running = current

        self.async_write_ha_state()

    def _fire(self, event: str, lesson: dict[str, Any]) -> None:
        """Announce a lesson boundary.

        Events exist alongside the state because the state cannot show everything: two
        periods of the same subject in a row are one state but two lessons.
        """
        self.hass.bus.async_fire(
            event,
            {
                ATTR_MEMBER: self._member.name,
                ATTR_MEMBER_ID: self._member.id,
                **lesson,
            },
        )

    # --- routines -----------------------------------------------------------

    def _packing(self) -> list[tuple[str, str]]:
        """What tomorrow's lessons need packed, as (item, subject) pairs.

        Tomorrow rather than today, because that is when a school bag is packed. A
        tomorrow that is a holiday, a care day or a sick day needs nothing, which is
        also why Friday evening is quiet and Sunday evening is not — without a single
        rule about weekends anywhere.
        """
        if not self._config.materials:
            return []
        tomorrow = dt_util.now().date() + timedelta(days=1)
        if self._mode_on(tomorrow) != MODE_SCHOOL:
            return []
        lessons = self._config.lessons_on(self._member.id, tomorrow)
        subjects = list(dict.fromkeys(lesson.subject for lesson in lessons))
        return self._config.packing_list(subjects)

    def _routine(self, block: str) -> list[dict[str, Any]]:
        """Today's steps for a block, each marked done or not.

        The evening also carries what tomorrow's subjects need packed. Those steps are
        generated rather than stored: typing "pack the PE kit" into Monday evening
        states the same fact as Tuesday's timetable, and the copy is the one nobody
        updates when the timetable changes. They tick off exactly like any other step —
        the store knows a step by its words, not by where it came from.
        """
        weekday, _ = self._now()
        completed = self._store.completed(self._member.id, block)
        steps = [
            {"step": step, "done": step in completed}
            for step in self._config.routine(self._member.id, block).steps_for(
                weekday, self._day_mode
            )
        ]
        if block != BLOCK_EVENING:
            return steps

        typed = {entry["step"].casefold() for entry in steps}
        for item, subject in self._packing():
            # A household that typed the step before the materials existed keeps
            # theirs: two identical lines, one tickable and one not, is worse than
            # either on its own.
            if item.casefold() in typed:
                continue
            steps.append(
                {
                    "step": item,
                    "done": item in completed,
                    ATTR_FROM_SUBJECT: subject,
                }
            )
        return steps

    @callback
    def _handle_change(self, _event: Any = None) -> None:
        """Re-publish when a routine tick changes."""
        self.async_write_ha_state()

    @callback
    def _handle_calendar_change(self, _event: Any = None) -> None:
        """A holiday or a care day was added, moved or removed."""
        self.hass.async_create_task(self._async_recheck())

    @callback
    def _handle_absence_change(self, _event: Any = None) -> None:
        """This member fell ill, or got better.

        Through the boundary logic, so switching it on at half past nine ends the
        lesson that was running instead of dropping it silently. The calendars are not
        re-read: nothing about them changed.
        """
        self._apply_boundary()

    async def _async_recheck(self) -> None:
        """Re-read the calendars and publish.

        Going through the boundary logic rather than writing the state directly is
        what makes the events honest — a holiday entered mid-morning ends the lesson
        that was running instead of dropping it silently.
        """
        await self._async_refresh_outlook()
        self._apply_boundary()

    # --- state --------------------------------------------------------------

    @property
    def native_value(self) -> str:
        """The subject running right now, or `free` between and after lessons."""
        lesson = self._lesson_now()
        return lesson[ATTR_SUBJECT] if lesson else STATE_FREE

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        """Identity, today's lessons and today's routine steps."""
        today = self._today()
        # De-duplicated, so a spoken "today you have German, Maths and PE" reads well
        # even when German is on twice.
        subjects = list(dict.fromkeys(entry[ATTR_SUBJECT] for entry in today))

        until = self._absence.until(self._member.id)
        return {
            ATTR_MEMBER_ID: self._member.id,
            ATTR_COLOR: self._member.color,
            ATTR_DAY_MODE: self._day_mode,
            ATTR_SICK_UNTIL: until.isoformat() if until else None,
            ATTR_OUTLOOK: self._published_outlook,
            ATTR_AVATAR: self._member.avatar,
            ATTR_ROUTINE_MORNING: self._routine(BLOCK_MORNING),
            ATTR_ROUTINE_EVENING: self._routine(BLOCK_EVENING),
            ATTR_TIMETABLE: self._config.timetable.member_card_dict(self._member.id),
            ATTR_TODAY: today,
            ATTR_TODAY_SUBJECTS: subjects,
            ATTR_TODAY_SUMMARY: ", ".join(subjects),
            ATTR_LESSON_NOW: self._lesson_now(),
            ATTR_LESSON_NEXT: self._lesson_next(),
        }
