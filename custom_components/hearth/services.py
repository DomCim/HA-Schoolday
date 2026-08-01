"""Hearth's services.

Only what the cards genuinely cannot do themselves. Calendars and to-do lists
are written through Home Assistant's own services; these two exist because
routine completion is Hearth's own state.
"""

from __future__ import annotations

import voluptuous as vol

from homeassistant.core import HomeAssistant, ServiceCall, callback
from homeassistant.exceptions import ServiceValidationError
from homeassistant.helpers import config_validation as cv

from .const import (
    ATTR_BLOCK,
    ATTR_DONE,
    ATTR_MEMBER,
    ATTR_STEP,
    DATA_STORE,
    DOMAIN,
    ROUTINE_BLOCKS,
    SERVICE_RESET_ROUTINE,
    SERVICE_SET_ROUTINE_STEP,
)
from .models import HearthConfig
from .store import RoutineStore

SET_STEP_SCHEMA = vol.Schema(
    {
        vol.Required(ATTR_MEMBER): cv.string,
        vol.Required(ATTR_BLOCK): vol.In(ROUTINE_BLOCKS),
        vol.Required(ATTR_STEP): cv.string,
        vol.Optional(ATTR_DONE, default=True): cv.boolean,
    }
)

RESET_SCHEMA = vol.Schema({vol.Optional(ATTR_MEMBER): cv.string})


def _config(hass: HomeAssistant) -> HearthConfig:
    """The current Hearth configuration, from the single config entry."""
    entries = hass.config_entries.async_entries(DOMAIN)
    if not entries:
        raise ServiceValidationError("Hearth is not set up")
    return HearthConfig.from_options(entries[0].options)


def _resolve_member_id(hass: HomeAssistant, value: str) -> str:
    """Accept either a member id or a member name, so scripts stay readable."""
    config = _config(hass)
    member = config.member_by_id(value) or config.member_by_name(value)
    if member is None:
        known = ", ".join(m.name for m in config.members) or "none configured"
        raise ServiceValidationError(
            f"No Hearth family member matches '{value}'. Known members: {known}"
        )
    return member.id


@callback
def async_register_services(hass: HomeAssistant) -> None:
    """Register Hearth's services, once per Home Assistant run."""
    if hass.services.has_service(DOMAIN, SERVICE_SET_ROUTINE_STEP):
        return

    async def _async_set_step(call: ServiceCall) -> None:
        store: RoutineStore = hass.data[DATA_STORE]
        await store.async_set(
            _resolve_member_id(hass, call.data[ATTR_MEMBER]),
            call.data[ATTR_BLOCK],
            call.data[ATTR_STEP],
            call.data[ATTR_DONE],
        )

    async def _async_reset(call: ServiceCall) -> None:
        store: RoutineStore = hass.data[DATA_STORE]
        member = call.data.get(ATTR_MEMBER)
        await store.async_reset(_resolve_member_id(hass, member) if member else None)

    hass.services.async_register(
        DOMAIN, SERVICE_SET_ROUTINE_STEP, _async_set_step, schema=SET_STEP_SCHEMA
    )
    hass.services.async_register(
        DOMAIN, SERVICE_RESET_ROUTINE, _async_reset, schema=RESET_SCHEMA
    )
