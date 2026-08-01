"""Sensors that expose the Hearth configuration to the cards.

There is deliberately no coordinator and no polling: everything these sensors report
already lives in `hass.states` (to-do lists publish their open-item count as their
state, `person` entities publish presence), so plain state tracking is both correct
and cheaper.
"""

from __future__ import annotations

from typing import Any

from homeassistant.components.sensor import SensorEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import STATE_UNAVAILABLE, STATE_UNKNOWN
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers.device_registry import DeviceEntryType, DeviceInfo
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback
from homeassistant.helpers.event import async_track_state_change_event

from .const import (
    ATTR_AVATAR,
    ATTR_CALENDARS,
    ATTR_COLOR,
    ATTR_MEMBER_ID,
    ATTR_MEMBERS,
    ATTR_POINTS,
    ATTR_PRESENCE,
    ATTR_TODO_LISTS,
    ATTR_VERSION,
    CONF_READONLY_CALENDARS,
    CONF_SHARED_CALENDARS,
    CONF_SHARED_TODO_LISTS,
    DOMAIN,
    VERSION,
)
from .models import HearthConfig, Member

UNKNOWN_STATES = {STATE_UNKNOWN, STATE_UNAVAILABLE}


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    """Set up the Hearth sensors."""
    config = HearthConfig.from_options(entry.options)
    _async_remove_orphans(hass, entry, config)

    async_add_entities(
        [
            HearthBoardSensor(entry, config),
            *(HearthMemberSensor(entry, member) for member in config.members),
        ]
    )


@callback
def _async_remove_orphans(
    hass: HomeAssistant, entry: ConfigEntry, config: HearthConfig
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
    """Group every Hearth entity under one service device."""
    return DeviceInfo(
        identifiers={(DOMAIN, entry.entry_id)},
        name="Hearth",
        manufacturer="Hearth",
        model="Family board",
        entry_type=DeviceEntryType.SERVICE,
        sw_version=VERSION,
    )


def _int_state(hass: HomeAssistant, entity_id: str) -> int | None:
    """Read an entity's state as an integer, or None if it is not a number."""
    state = hass.states.get(entity_id)
    if state is None or state.state in UNKNOWN_STATES:
        return None
    try:
        return int(float(state.state))
    except (TypeError, ValueError):
        return None


class HearthBaseSensor(SensorEntity):
    """Shared plumbing for Hearth's sensors."""

    _attr_has_entity_name = True
    _attr_should_poll = False

    def __init__(self, entry: ConfigEntry) -> None:
        """Attach the entity to the Hearth service device."""
        self._attr_device_info = _device_info(entry)


class HearthBoardSensor(HearthBaseSensor):
    """One entity carrying the whole family setup, for the cards to read.

    The cards read this instead of being configured with member lists of their own, so
    changing a colour or a calendar in the options flow updates every card at once.
    """

    _attr_icon = "mdi:bulletin-board"
    _attr_translation_key = "board"

    def __init__(self, entry: ConfigEntry, config: HearthConfig) -> None:
        """Initialise the board sensor."""
        super().__init__(entry)
        self._config = config
        self._attr_unique_id = _board_unique_id(entry)

    @property
    def native_value(self) -> int:
        """Number of configured family members."""
        return len(self._config.members)

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        """The full Hearth configuration."""
        return {
            ATTR_MEMBERS: [member.as_card_dict() for member in self._config.members],
            CONF_SHARED_CALENDARS: self._config.shared_calendars,
            CONF_SHARED_TODO_LISTS: self._config.shared_todo_lists,
            CONF_READONLY_CALENDARS: self._config.readonly_calendars,
            ATTR_VERSION: VERSION,
        }


class HearthMemberSensor(HearthBaseSensor):
    """One family member: open tasks as the state, identity as attributes."""

    _attr_icon = "mdi:account"

    def __init__(self, entry: ConfigEntry, member: Member) -> None:
        """Initialise a member sensor."""
        super().__init__(entry)
        self._member = member
        self._attr_name = member.name
        self._attr_unique_id = _member_unique_id(entry, member.id)

    async def async_added_to_hass(self) -> None:
        """Follow the entities this member is made of."""
        if tracked := self._member.tracked_entities:
            self.async_on_remove(
                async_track_state_change_event(self.hass, tracked, self._handle_change)
            )

    @callback
    def _handle_change(self, _event: Any) -> None:
        """Re-publish when a tracked entity changes."""
        self.async_write_ha_state()

    @property
    def native_value(self) -> int | None:
        """Open to-do items across this member's lists."""
        if not self._member.todo_lists:
            return None
        counts = [
            count
            for entity_id in self._member.todo_lists
            if (count := _int_state(self.hass, entity_id)) is not None
        ]
        return sum(counts) if counts else None

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        """Identity and linked entities, for the cards."""
        presence: str | None = None
        if self._member.person and (state := self.hass.states.get(self._member.person)):
            presence = state.state

        points: int | None = None
        if self._member.points_entity:
            points = _int_state(self.hass, self._member.points_entity)

        return {
            ATTR_MEMBER_ID: self._member.id,
            ATTR_COLOR: self._member.color,
            ATTR_AVATAR: self._member.avatar,
            ATTR_PRESENCE: presence,
            ATTR_POINTS: points,
            ATTR_CALENDARS: self._member.calendars,
            ATTR_TODO_LISTS: self._member.todo_lists,
        }
