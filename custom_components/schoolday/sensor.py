"""Sensors that expose the Schoolday configuration to the cards and to automations.

There is deliberately no coordinator and no polling. The routine ticks arrive over a
dispatcher signal, and the only thing that changes on its own is which lesson is
running — which happens at times the timetable already knows, so the member sensors
wake up exactly at those and sleep in between.
"""

from __future__ import annotations

from datetime import datetime, timedelta
from typing import Any

from homeassistant.components.sensor import SensorEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, callback
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
    ATTR_AVATAR,
    ATTR_BOARD,
    ATTR_COLOR,
    ATTR_LESSON_NEXT,
    ATTR_LESSON_NOW,
    ATTR_MEMBER,
    ATTR_MEMBER_ID,
    ATTR_MEMBERS,
    ATTR_NO_SCHOOL,
    ATTR_PERIOD,
    ATTR_ROOM,
    ATTR_ROUTINE_BLOCKS,
    ATTR_ROUTINE_EVENING,
    ATTR_ROUTINE_MORNING,
    ATTR_SCHOOL_TODAY,
    ATTR_SUBJECT,
    ATTR_TIMETABLE,
    ATTR_TODAY,
    ATTR_TODAY_SUBJECTS,
    ATTR_TODAY_SUMMARY,
    ATTR_VERSION,
    BLOCK_EVENING,
    BLOCK_MORNING,
    DATA_STORE,
    DOMAIN,
    EVENT_LESSON_ENDED,
    EVENT_LESSON_STARTED,
    ROUTINE_BLOCKS,
    SIGNAL_ROUTINE_UPDATED,
    STATE_FREE,
    VERSION,
)
from .models import Lesson, Member, Period, SchooldayConfig
from .store import RoutineStore


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    """Set up the Schoolday sensors."""
    config = SchooldayConfig.from_options(entry.options)
    _async_remove_orphans(hass, entry, config)

    store: RoutineStore = hass.data[DATA_STORE]
    async_add_entities(
        [
            SchooldayBoardSensor(entry, config),
            *(
                SchooldayMemberSensor(entry, member, config, store)
                for member in config.members
            ),
        ]
    )


@callback
def _async_remove_orphans(
    hass: HomeAssistant, entry: ConfigEntry, config: SchooldayConfig
) -> None:
    """Drop registry entries for members that no longer exist."""
    registry = er.async_get(hass)
    expected = {
        _board_unique_id(entry),
        *(_member_unique_id(entry, member.id) for member in config.members),
    }
    for registry_entry in er.async_entries_for_config_entry(registry, entry.entry_id):
        if registry_entry.unique_id not in expected:
            registry.async_remove(registry_entry.entity_id)


def _board_unique_id(entry: ConfigEntry) -> str:
    return f"{entry.entry_id}_board"


def _member_unique_id(entry: ConfigEntry, member_id: str) -> str:
    return f"{entry.entry_id}_{member_id}"


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
            ATTR_TIMETABLE: self._config.timetable.as_card_dict(),
            ATTR_SCHOOL_TODAY: reason is None,
            ATTR_NO_SCHOOL: reason,
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
    ) -> None:
        """Initialise a member sensor."""
        super().__init__(entry)
        self._member = member
        self._config = config
        self._store = store
        self._attr_name = member.name
        self._attr_unique_id = _member_unique_id(entry, member.id)
        #: The lesson considered running, so a boundary knows what just ended.
        self._running: dict[str, Any] | None = None
        self._unsub_boundary: Any = None

    async def async_added_to_hass(self) -> None:
        """Follow the routine ticks and the holidays, and wake at the next boundary."""
        self.async_on_remove(
            async_dispatcher_connect(
                self.hass, SIGNAL_ROUTINE_UPDATED, self._handle_change
            )
        )
        if calendars := self._config.school_calendars:
            self.async_on_remove(
                async_track_state_change_event(
                    self.hass, calendars, self._handle_calendar_change
                )
            )
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

    @property
    def _school_today(self) -> bool:
        return _no_school_reason(self.hass, self._config) is None

    def _lesson_now(self) -> dict[str, Any] | None:
        if not self._school_today:
            return None
        weekday, minutes = self._now()
        found = self._config.timetable.lesson_at(self._member.id, weekday, minutes)
        return _lesson_dict(*found) if found else None

    def _lesson_next(self) -> dict[str, Any] | None:
        if not self._school_today:
            return None
        weekday, minutes = self._now()
        found = self._config.timetable.next_lesson(self._member.id, weekday, minutes)
        return _lesson_dict(*found) if found else None

    def _today(self) -> list[dict[str, Any]]:
        # On a holiday there is nothing on today — which is what makes the morning
        # announcement fall silent by itself, with no second condition to maintain.
        if not self._school_today:
            return []
        weekday, _ = self._now()
        timetable = self._config.timetable
        periods = {period.index: period for period in timetable.periods}
        return [
            _lesson_dict(lesson, periods[lesson.period])
            for lesson in timetable.day(self._member.id, weekday)
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

    @callback
    def _handle_boundary(self, _now: datetime) -> None:
        """A lesson started, a lesson ended, or the day rolled over."""
        self._unsub_boundary = None
        current = self._lesson_now()

        if current != self._running:
            if self._running is not None:
                self._fire(EVENT_LESSON_ENDED, self._running)
            if current is not None:
                self._fire(EVENT_LESSON_STARTED, current)
            self._running = current

        self.async_write_ha_state()
        self._schedule_boundary()

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

    def _routine(self, block: str) -> list[dict[str, Any]]:
        """Today's steps for a block, each marked done or not."""
        weekday, _ = self._now()
        steps = self._config.routine(self._member.id, block).steps_for(weekday)
        completed = self._store.completed(self._member.id, block)
        return [{"step": step, "done": step in completed} for step in steps]

    @callback
    def _handle_change(self, _event: Any = None) -> None:
        """Re-publish when a routine tick changes."""
        self.async_write_ha_state()

    @callback
    def _handle_calendar_change(self, _event: Any = None) -> None:
        """A holiday started or ended: end the running lesson, then re-publish.

        Going through the boundary handler rather than writing the state directly is
        what makes the events honest — a holiday that begins mid-morning ends the
        lesson that was running instead of dropping it silently.
        """
        self._handle_boundary(dt_util.now())

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

        return {
            ATTR_MEMBER_ID: self._member.id,
            ATTR_COLOR: self._member.color,
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
