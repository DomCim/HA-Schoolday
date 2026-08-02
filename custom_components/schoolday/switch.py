"""A switch per child for the day they are at home ill.

Deliberately a switch and not a routine day or a calendar event. A calendar entry is
something you plan; being ill is something you find out at seven in the morning, one
tap away from the board that is already on the wall.

Switching it on closes the day for that child and nobody else: their lessons empty
out, their routine falls silent, and the morning announcement skips them without a
single extra condition anywhere. Switching it off puts the day back.
"""

from __future__ import annotations

from typing import Any

from homeassistant.components.switch import SwitchEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.device_registry import DeviceEntryType, DeviceInfo
from homeassistant.helpers.dispatcher import async_dispatcher_connect
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback

from .const import (
    ATTR_SICK_UNTIL,
    DATA_ABSENCE,
    DOMAIN,
    SIGNAL_ABSENCE_UPDATED,
    VERSION,
)
from .models import Member, SchooldayConfig
from .sensor import sick_unique_id
from .store import AbsenceStore


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    """Set up one ill-today switch per family member."""
    config = SchooldayConfig.from_options(entry.options)
    store: AbsenceStore = hass.data[DATA_ABSENCE]
    async_add_entities(
        SchooldaySickSwitch(entry, member, store) for member in config.members
    )


class SchooldaySickSwitch(SwitchEntity):
    """Whether one child is at home ill today."""

    _attr_has_entity_name = True
    _attr_should_poll = False
    _attr_icon = "mdi:emoticon-sick-outline"
    _attr_translation_key = "sick"

    def __init__(
        self, entry: ConfigEntry, member: Member, store: AbsenceStore
    ) -> None:
        """Initialise the switch for one member."""
        self._member = member
        self._store = store
        self._attr_unique_id = sick_unique_id(entry, member.id)
        self._attr_translation_placeholders = {"name": member.name}
        self._attr_device_info = DeviceInfo(
            identifiers={(DOMAIN, entry.entry_id)},
            name="Schoolday",
            manufacturer="Schoolday",
            model="Timetable and routines",
            entry_type=DeviceEntryType.SERVICE,
            sw_version=VERSION,
        )

    async def async_added_to_hass(self) -> None:
        """Follow the store, so the service and the switch never disagree."""
        self.async_on_remove(
            async_dispatcher_connect(
                self.hass, SIGNAL_ABSENCE_UPDATED, self._handle_change
            )
        )

    @callback
    def _handle_change(self, _event: Any = None) -> None:
        self.async_write_ha_state()

    @property
    def is_on(self) -> bool:
        """True while this member is ill."""
        return self._store.is_absent(self._member.id)

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        """The last day of the absence, so a card can say more than on or off."""
        until = self._store.until(self._member.id)
        return {ATTR_SICK_UNTIL: until.isoformat() if until else None}

    async def async_turn_on(self, **kwargs: Any) -> None:
        """Mark this member ill for today.

        Today rather than "until further notice": see :class:`AbsenceStore`. Longer
        goes through `schoolday.set_absent`, which takes a date.
        """
        await self._store.async_set(self._member.id, True)

    async def async_turn_off(self, **kwargs: Any) -> None:
        """Say this member is better."""
        await self._store.async_set(self._member.id, False)
