"""Sensors that expose the Schoolday configuration to the cards and to automations.

There is deliberately no coordinator and no polling. The routine ticks arrive over a
dispatcher signal, and the only thing that changes on its own is which lesson is
running — which happens at times the timetable already knows, so the member sensors
wake up exactly at those and sleep in between.
"""

from __future__ import annotations

import asyncio
import logging
from collections.abc import Iterable, Mapping
from datetime import date, datetime, time, timedelta
from typing import Any

from homeassistant.components.sensor import SensorDeviceClass, SensorEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, callback
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers.device_registry import DeviceEntryType, DeviceInfo
from homeassistant.helpers.dispatcher import async_dispatcher_connect
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback
from homeassistant.helpers.event import (
    async_call_later,
    async_track_point_in_time,
    async_track_state_change_event,
    async_track_time_interval,
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
    ATTR_EXAMS,
    ATTR_FROM_SUBJECT,
    ATTR_LABEL,
    ATTR_LEAVE_AT,
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
    ATTR_ROUTINE_STATS,
    ATTR_SCHEDULE,
    ATTR_SCHOOL_END,
    ATTR_SCHOOL_START,
    ATTR_SCHOOL_TODAY,
    ATTR_SICK_UNTIL,
    ATTR_SUBJECT,
    ATTR_TIMETABLE,
    ATTR_TODAY,
    ATTR_TODAY_SUBJECTS,
    ATTR_TODAY_SUMMARY,
    ATTR_TOMORROW_END,
    ATTR_TOMORROW_EXAMS,
    ATTR_TOMORROW_START,
    ATTR_TOMORROW_SUBJECTS,
    ATTR_TOMORROW_SUMMARY,
    ATTR_TRAVEL_MINUTES,
    ATTR_VERSION,
    ATTR_WEEK,
    ATTR_WEEKDAY,
    BLOCK_EVENING,
    BLOCK_MORNING,
    DATA_ABSENCE,
    DATA_HISTORY,
    DATA_STORE,
    DOMAIN,
    EVENT_LESSON_ENDED,
    EVENT_LESSON_STARTED,
    EVENT_PLAN_CHANGED,
    FEED_REFRESH_MINUTES,
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
from .models import (
    FeedEvent,
    Lesson,
    Member,
    Period,
    SchooldayConfig,
    cancelled_periods,
    exams_by_day,
    substituted_periods,
)
from .plan import ChangeWatch, day_change, day_span, message
from .store import AbsenceStore, HistoryStore, RoutineStore

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
    history: HistoryStore = hass.data[DATA_HISTORY]
    members = [
        SchooldayMemberSensor(entry, member, config, store, absence, history)
        for member in config.members
    ]
    # Only for a member with a way to school: a household that never says how far it
    # is should not find a sensor that is unknown forever.
    leaving = [
        SchooldayLeaveSensor(entry, sensor)
        for sensor in members
        if sensor.member.travel_minutes is not None
    ]
    async_add_entities([SchooldayBoardSensor(entry, config), *members, *leaving])


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
        *(
            _leave_unique_id(entry, member.id)
            for member in config.members
            if member.travel_minutes is not None
        ),
    }
    for registry_entry in er.async_entries_for_config_entry(registry, entry.entry_id):
        if registry_entry.unique_id not in expected:
            registry.async_remove(registry_entry.entity_id)


def _board_unique_id(entry: ConfigEntry) -> str:
    return f"{entry.entry_id}_board"


def _member_unique_id(entry: ConfigEntry, member_id: str) -> str:
    return f"{entry.entry_id}_{member_id}"


def _leave_unique_id(entry: ConfigEntry, member_id: str) -> str:
    return f"{entry.entry_id}_{member_id}_leave"


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


def _feed_events(events: Iterable[Mapping[str, Any]]) -> list[FeedEvent]:
    """A school system's events, in local minutes on the day each one starts.

    A lesson does not run past midnight, so a timed event is taken to belong to the day
    it starts on. An all-day event keeps every day it covers, without times.
    """
    feed: list[FeedEvent] = []
    for event in events:
        summary = str(event.get("summary") or "")
        raw_start = str(event.get("start") or "")
        # An all-day event is told apart by its shape, a bare `YYYY-MM-DD`, rather than
        # by parse_datetime failing on it: that parser reads a bare date as midnight,
        # and an all-day "Unterrichtsausfall" would then cancel every lesson of the day.
        start_at = (
            dt_util.parse_datetime(raw_start)
            if raw_start and dt_util.parse_date(raw_start) is None
            else None
        )
        if start_at is None:
            feed.extend(FeedEvent(day=day, summary=summary) for day in _event_days(event))
            continue
        begins = dt_util.as_local(start_at)
        raw_end = str(event.get("end") or "")
        end_at = dt_util.parse_datetime(raw_end) if raw_end else None
        ends = dt_util.as_local(end_at) if end_at is not None else begins
        start = begins.hour * 60 + begins.minute
        end = (
            ends.hour * 60 + ends.minute if ends.date() == begins.date() else 24 * 60
        )
        feed.append(
            FeedEvent(
                day=begins.date(),
                summary=summary,
                start=start,
                end=end,
                location=str(event.get("location") or "") or None,
            )
        )
    return feed


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
        history: HistoryStore,
    ) -> None:
        """Initialise a member sensor."""
        super().__init__(entry)
        self._member = member
        self._config = config
        self._store = store
        self._absence = absence
        self._history = history
        self._attr_name = member.name
        self._attr_unique_id = _member_unique_id(entry, member.id)
        #: The lesson considered running, so a boundary knows what just ended.
        self._running: dict[str, Any] | None = None
        self._unsub_boundary: Any = None
        #: This week and the next seven days, in date order, and the day built for.
        self._outlook: list[dict[str, Any]] = []
        self._outlook_date: date | None = None
        #: What the school system's calendars said, per date: the periods it cancelled
        #: or gave to somebody else on top of what the household said, and the exams.
        #: All a reading of a calendar, never written into the configuration — the next
        #: read replaces them.
        self._feed_cancelled: dict[date, set[int]] = {}
        self._feed_swapped: dict[date, dict[int, Lesson]] = {}
        self._exams: dict[date, list[dict[str, Any]]] = {}
        #: Two readings at once — a calendar changing while the regular re-read runs —
        #: would both compare against the same old day and announce one change twice.
        self._refresh_lock = asyncio.Lock()
        #: Whether the last reading got an answer from every school-system calendar.
        #: A reading that did not has no cancellations in it, and comparing against it
        #: would announce every one the school already had as new.
        self._feed_read = False
        self._watch = ChangeWatch()
        self._unsub_recheck: Any = None
        #: The leaving-time sensor that publishes from this one, when there is one.
        self.leave: SchooldayLeaveSensor | None = None

    @property
    def member(self) -> Member:
        """The family member this sensor is about."""
        return self._member

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
        watched = [*self._config.school_calendars, *self._member_calendars]
        if watched:
            self.async_on_remove(
                async_track_state_change_event(
                    self.hass, watched, self._handle_calendar_change
                )
            )
        if self._member.lessons_calendar or self._member.exams_calendar:
            self.async_on_remove(
                async_track_time_interval(
                    self.hass,
                    self._handle_calendar_change,
                    timedelta(minutes=FEED_REFRESH_MINUTES),
                )
            )

        await self._async_refresh_outlook()
        self._record_today()
        # Adopt whatever is running without announcing it: Home Assistant restarting
        # mid-morning must not fire "PE has started" into the kitchen.
        self._running = self._lesson_now()
        self._schedule_boundary()
        self.async_on_remove(self._cancel_boundary)
        self.async_on_remove(self._cancel_recheck)

    # --- timetable ----------------------------------------------------------

    @property
    def _member_calendars(self) -> list[str]:
        """This member's own calendars, each once, in no particular order of meaning."""
        member = self._member
        return list(
            dict.fromkeys(
                entity_id
                for entity_id in (
                    member.calendar,
                    member.lessons_calendar,
                    member.exams_calendar,
                )
                if entity_id
            )
        )

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
        """Read the calendars again, and say what that changed about the days ahead.

        The first reading after a start is only the baseline: whatever the school
        changed while Home Assistant was down is not news it can date, and announcing
        the whole week on every restart would teach everybody to ignore the message.
        Nor is a reading the calendars did not answer, which is the usual first one —
        the calendar integration often starts after Schoolday — and a change has to be
        read twice before it is said: see `ChangeWatch`.
        """
        async with self._refresh_lock:
            await self._async_read_outlook()
            if not self._feed_read:
                return
            after = self._school_days()
            verdict, before = self._watch.observe(after)
            if verdict == "change" and before is not None:
                self._announce_changes(before, after)
            elif verdict == "recheck" and self._unsub_recheck is None:
                self._unsub_recheck = async_call_later(self.hass, 60, self._handle_recheck)

    @callback
    def _handle_recheck(self, _now: Any = None) -> None:
        """The second look a disagreeing reading asked for."""
        self._unsub_recheck = None
        self.hass.async_create_task(self._async_recheck())

    @callback
    def _cancel_recheck(self) -> None:
        if self._unsub_recheck is not None:
            self._unsub_recheck()
            self._unsub_recheck = None

    async def _async_read_outlook(self) -> None:
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
        calendars = list(
            dict.fromkeys([*self._config.school_calendars, *self._member_calendars])
        )
        events = await self._async_read_events(calendars, start, end)
        self._feed_read = all(
            entity_id in events
            for entity_id in (self._member.lessons_calendar, self._member.exams_calendar)
            if entity_id
        )

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

        # What the school system says, laid under what the household said: a period
        # somebody changed by hand is theirs, whatever the calendar thinks of it, and a
        # day that is not a school day has no lessons left to cancel.
        periods = self._periods
        cancelled: dict[date, set[int]] = {}
        substituted: dict[date, dict[int, Lesson]] = {}
        if self._member.lessons_calendar:
            lessons_feed = _feed_events(events.get(self._member.lessons_calendar, []))
            cancelled = cancelled_periods(
                lessons_feed, periods, self._config.cancel_keywords
            )
            substituted = substituted_periods(
                lessons_feed, periods, self._config.substitute_keywords
            )
        self._exams = (
            exams_by_day(_feed_events(events.get(self._member.exams_calendar, [])), periods)
            if self._member.exams_calendar
            else {}
        )
        self._feed_cancelled = {}
        self._feed_swapped = {}
        rung = {period.index for period in periods}
        for day in days:
            entry = entries[day]
            if exams := self._exams.get(day):
                entry[ATTR_EXAMS] = exams
            if entry[ATTR_MODE] != MODE_SCHOOL or (
                day not in cancelled and day not in substituted
            ):
                continue
            change = self._config.exception(self._member.id, day)
            said = set(change.periods if change else ())
            held = {
                lesson.period: lesson
                for lesson in self._config.lessons_on(self._member.id, day)
            }
            swapped: dict[int, Lesson] = {}
            for period, lesson in substituted.get(day, {}).items():
                if period in said or period not in rung:
                    continue
                planned = held.get(period)
                if planned is not None and planned.subject.casefold() == lesson.subject.casefold():
                    # The same subject with another teacher is the lesson the timetable
                    # promised; only a new room is worth saying, in the household's
                    # spelling of the subject.
                    if not lesson.room or lesson.room == planned.room:
                        continue
                    lesson = Lesson(period=period, subject=planned.subject, room=lesson.room)
                swapped[period] = lesson
            # A substitution beats a cancellation in the same period: WebUntis reports a
            # replaced lesson as the old one cancelled and the new one irregular, and
            # believing only the first would send the child home from a lesson that is
            # on. Only periods with a lesson in them can be cancelled — an empty slot
            # marked cancelled would draw a struck-through nothing.
            gone = (cancelled.get(day, set()) & set(held)) - said - set(swapped)
            if not gone and not swapped:
                continue
            if gone:
                self._feed_cancelled[day] = gone
            if swapped:
                self._feed_swapped[day] = swapped
            merged = {
                **entry.get(ATTR_CHANGES, {}),
                **{str(p): None for p in gone},
                **{str(p): lesson.as_card_dict() for p, lesson in swapped.items()},
            }
            entry[ATTR_CHANGES] = dict(sorted(merged.items(), key=lambda item: int(item[0])))

        self._outlook = [entries[day] for day in days]

    def _school_days(self) -> dict[date, list[Lesson]]:
        """Each school day of the outlook with the lessons it holds, for comparing.

        By the calendars' answer alone, without this child's illness: falling ill is
        not something the school changed.
        """
        rung = {period.index for period in self._periods}
        return {
            date.fromisoformat(str(entry[ATTR_DATE])): [
                lesson
                for lesson in self._lessons_on(date.fromisoformat(str(entry[ATTR_DATE])))
                if lesson.period in rung
            ]
            for entry in self._outlook
            if entry[ATTR_MODE] == MODE_SCHOOL
        }

    @callback
    def _announce_changes(
        self, before: dict[date, list[Lesson]], after: dict[date, list[Lesson]]
    ) -> None:
        """Fire an event for every day still to come whose lessons are not what they were.

        Only days that were school days in both readings: a holiday appearing in the
        holiday calendar is the household's own doing, not the school's news. Today
        only counts from now on — a cancelled lesson that is already over has nothing
        left for anybody to do about it.
        """
        now = dt_util.now()
        today = now.date()
        minutes = now.hour * 60 + now.minute
        periods = self._periods
        ends = {period.index: period.end_minutes for period in periods}
        for day in sorted(before.keys() & after.keys()):
            if day < today:
                continue
            old, new = before[day], after[day]
            if day == today:
                old = [lesson for lesson in old if ends.get(lesson.period, 0) > minutes]
                new = [lesson for lesson in new if ends.get(lesson.period, 0) > minutes]
            change = day_change(
                old, new, periods, self._config.lessons_on(self._member.id, day)
            )
            if change is None:
                continue
            # Spans from the whole day, not the part still to come: "starts 08:45" is
            # only true of a day that starts at all, and today's start is behind it.
            spans = (day_span(before[day], periods), day_span(after[day], periods))
            change.before, change.after = spans
            by_index = {period.index: period for period in periods}
            self.hass.bus.async_fire(
                EVENT_PLAN_CHANGED,
                {
                    ATTR_MEMBER: self._member.name,
                    ATTR_MEMBER_ID: self._member.id,
                    ATTR_DATE: day.isoformat(),
                    "days_ahead": (day - today).days,
                    "cancelled": [
                        _lesson_dict(lesson, by_index[lesson.period])
                        for lesson in change.cancelled
                    ],
                    "changed": [
                        {
                            **_lesson_dict(item.lesson, by_index[item.lesson.period]),
                            "instead": item.instead.subject if item.instead else None,
                            "restored": item.restored,
                        }
                        for item in change.changed
                    ],
                    "start": spans[1][0].start if spans[1] else None,
                    "end": spans[1][1].end if spans[1] else None,
                    "previous_start": spans[0][0].start if spans[0] else None,
                    "previous_end": spans[0][1].end if spans[0] else None,
                    "message": message(
                        self.hass.config.language, self._member.name, day, today, change
                    ),
                },
            )

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
        return self._lessons_on(dt_util.now().date())

    def _lessons_on(self, day: date) -> list[Lesson]:
        """A dated day's lessons, with what the school system changed applied too.

        The configuration's answer plus the calendar's, in this one place, so the card,
        the announcement and the packing list all lose the same cancelled lesson and
        pack for the same substitute.
        """
        lessons = self._config.lessons_on(self._member.id, day)
        gone = self._feed_cancelled.get(day, set())
        swapped = self._feed_swapped.get(day, {})
        if not gone and not swapped:
            return lessons
        by_period = {
            lesson.period: lesson for lesson in lessons if lesson.period not in gone
        }
        by_period.update(swapped)
        return [by_period[period] for period in sorted(by_period)]

    @property
    def _periods(self) -> list[Period]:
        """The times this member's school rings to, which need not be the household's."""
        return self._config.periods_for(self._member.id)

    def _lesson_now(self) -> dict[str, Any] | None:
        if not self._school_today:
            return None
        _weekday, minutes = self._now()
        period = self._config.timetable.period_at(minutes, self._periods)
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
        for period in self._periods:
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
        periods = {period.index: period for period in self._periods}
        return [
            _lesson_dict(lesson, periods[lesson.period])
            for lesson in self._lessons_today()
            if lesson.period in periods
        ]

    def _subjects_tomorrow(self) -> list[str]:
        """Tomorrow's subjects, de-duplicated, or none when tomorrow is not a school day.

        One answer for the packing list and the evening announcement, so the bag and
        the sentence about the bag cannot disagree. Asked again on every publish rather
        than kept: the midnight boundary publishes, which is what moves it along a day.
        """
        tomorrow = dt_util.now().date() + timedelta(days=1)
        if self._mode_on(tomorrow) != MODE_SCHOOL:
            return []
        # Only periods this member's school actually rings, like today: a lesson in a
        # slot with no time is not on any card, so it should not be packed for either.
        rung = {period.index for period in self._periods}
        return list(
            dict.fromkeys(
                lesson.subject
                for lesson in self._lessons_on(tomorrow)
                if lesson.period in rung
            )
        )

    def _span_on(self, day: date) -> tuple[Period, Period] | None:
        """The first and last period with a lesson on a date, or None without school.

        Through the same two questions as tomorrow's subjects — is it a school day for
        this child, and what is left of it — so the start an alarm follows and the list
        the bag is packed from cannot disagree about a cancelled first period.
        """
        if self._mode_on(day) != MODE_SCHOOL:
            return None
        return day_span(self._lessons_on(day), self._periods)

    def next_leave(self) -> tuple[datetime, datetime] | None:
        """When this member next has to set off, and the start they are setting off for.

        Today's until the first lesson has begun, then the next school day's: between
        the two the time is in the past, which is what lets a card say "go now" while
        the automation that fired at it has nothing left to fire at.
        """
        travel = self._member.travel_minutes
        if travel is None:
            return None
        now = dt_util.now()
        for offset in range(OUTLOOK_DAYS):
            day = now.date() + timedelta(days=offset)
            span = self._span_on(day)
            if span is None:
                continue
            starts = dt_util.start_of_local_day(day) + timedelta(
                minutes=span[0].start_minutes
            )
            if starts <= now:
                continue
            return starts - timedelta(minutes=travel), starts
        return None

    def _exams_from_today(self) -> list[dict[str, Any]]:
        """Every exam from today to the end of the outlook, in date order."""
        today = dt_util.now().date()
        return [
            exam for day in sorted(self._exams) if day >= today for exam in self._exams[day]
        ]

    def _exams_tomorrow(self) -> list[str]:
        """Tomorrow's exam titles, or none when tomorrow is not a school day.

        The same rule as tomorrow's subjects, so the evening announcement cannot warn
        about a test on a day the child is off sick or the school is shut.
        """
        tomorrow = dt_util.now().date() + timedelta(days=1)
        if self._mode_on(tomorrow) != MODE_SCHOOL:
            return []
        return [str(exam["title"]) for exam in self._exams.get(tomorrow, [])]

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
            mark
            for mark in self._config.timetable.boundaries_in(self._periods)
            if mark > minutes
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

        # The midnight boundary comes through here, which is what puts a day nobody
        # touched on the record: "nothing was ticked" is exactly the day worth knowing.
        self._record_today()
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
        return self._config.packing_list(self._subjects_tomorrow())

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
    def _record_today(self) -> None:
        """Put today's routine on the record, as it stands right now.

        Here rather than in the store because this is the only place that knows both
        halves: the store knows what has been ticked, and only this sensor knows what
        was on the list, since the evening list is partly generated from tomorrow's
        lessons. Done on every publish because at midnight the ticks are already gone —
        there is no end of the day left to read.
        """
        mode = self._day_mode
        for block in ROUTINE_BLOCKS:
            steps = self._routine(block)
            self._history.record(
                self._member.id,
                mode,
                block,
                [entry["step"] for entry in steps],
                [entry["step"] for entry in steps if entry["done"]],
            )

    @callback
    def _handle_change(self, _event: Any = None) -> None:
        """Re-publish when a routine tick changes."""
        self._record_today()
        self.async_write_ha_state()

    @callback
    def _handle_calendar_change(self, _event: Any = None) -> None:
        """A holiday, a care day, a cancellation or an exam was added, moved or removed."""
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

    @callback
    def async_write_ha_state(self) -> None:
        """Publish, and let the leaving time follow.

        The leaving time is worked out from this sensor's day and changes exactly when
        it does — at the first bell, at midnight, when a calendar is read — so it is
        published from here rather than given clocks and listeners of its own.
        """
        super().async_write_ha_state()
        if self.leave is not None and self.leave.hass is not None:
            self.leave.async_write_ha_state()

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

        tomorrow = self._subjects_tomorrow()
        today_span = self._span_on(dt_util.now().date())
        tomorrow_span = self._span_on(dt_util.now().date() + timedelta(days=1))
        leave = self.next_leave()

        until = self._absence.until(self._member.id)
        return {
            # The name as typed, so an announcement about several children can say who
            # without taking the friendly name apart.
            ATTR_MEMBER: self._member.name,
            ATTR_MEMBER_ID: self._member.id,
            ATTR_COLOR: self._member.color,
            ATTR_DAY_MODE: self._day_mode,
            ATTR_SICK_UNTIL: until.isoformat() if until else None,
            ATTR_OUTLOOK: self._published_outlook,
            ATTR_AVATAR: self._member.avatar,
            ATTR_ROUTINE_MORNING: self._routine(BLOCK_MORNING),
            ATTR_ROUTINE_EVENING: self._routine(BLOCK_EVENING),
            # The record of the last few weeks, for the statistics card and for the
            # automation that wants to say something about a fortnight without a miss.
            ATTR_ROUTINE_STATS: self._history.stats(self._member.id),
            ATTR_TIMETABLE: self._config.timetable.member_card_dict(self._member.id),
            # Which school's times this member rings to. The board carries the times
            # themselves, once each, so a card reads the name here and the grid there.
            ATTR_SCHEDULE: self._member.schedule,
            ATTR_TODAY: today,
            ATTR_TODAY_SUBJECTS: subjects,
            ATTR_TODAY_SUMMARY: ", ".join(subjects),
            ATTR_TOMORROW_SUBJECTS: tomorrow,
            ATTR_TOMORROW_SUMMARY: ", ".join(tomorrow),
            ATTR_EXAMS: self._exams_from_today(),
            ATTR_TOMORROW_EXAMS: self._exams_tomorrow(),
            ATTR_SCHOOL_START: today_span[0].start if today_span else None,
            ATTR_SCHOOL_END: today_span[1].end if today_span else None,
            ATTR_TOMORROW_START: tomorrow_span[0].start if tomorrow_span else None,
            ATTR_TOMORROW_END: tomorrow_span[1].end if tomorrow_span else None,
            ATTR_LEAVE_AT: leave[0].isoformat() if leave else None,
            ATTR_LESSON_NOW: self._lesson_now(),
            ATTR_LESSON_NEXT: self._lesson_next(),
        }


class SchooldayLeaveSensor(SchooldayBaseSensor):
    """When a member has to set off for school, as a timestamp.

    A timestamp sensor because that is what a time trigger can follow — "ten minutes
    before this" — with no template, and what makes the alarm move by itself when the
    first lesson is cancelled. It holds nothing of its own: the member sensor knows the
    day and publishes this whenever it publishes itself.
    """

    _attr_device_class = SensorDeviceClass.TIMESTAMP
    _attr_icon = "mdi:walk"
    _attr_translation_key = "leave"

    def __init__(self, entry: ConfigEntry, member: SchooldayMemberSensor) -> None:
        """Attach to the member sensor this follows."""
        super().__init__(entry)
        self._source = member
        member.leave = self
        self._attr_unique_id = _leave_unique_id(entry, member.member.id)
        self._attr_translation_placeholders = {"name": member.member.name}

    @property
    def native_value(self) -> datetime | None:
        """The next time to leave, or nothing in the outlook to leave for."""
        leave = self._source.next_leave()
        return leave[0] if leave else None

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        """Who, how far, and the bell this leaving time is for."""
        leave = self._source.next_leave()
        member = self._source.member
        return {
            ATTR_MEMBER: member.name,
            ATTR_MEMBER_ID: member.id,
            ATTR_TRAVEL_MINUTES: member.travel_minutes,
            "starts_at": leave[1].isoformat() if leave else None,
        }
