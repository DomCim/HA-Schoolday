"""Schoolday's services.

Two kinds live here. `set_routine_step` and `reset_routine` write Schoolday's own
state — which steps are ticked off today.

The rest write the configuration, and exist because a Lovelace card cannot edit a
config entry but can call a service. That is what lets a management card offer what
the options dialog offers, so nobody has to go and find the integration page. They
were deliberately absent while the options flow was the only way in; the household
asking for a card is what changed that.

Every one of them validates what the options flow validates. A card must not be able
to write a timetable the sensors can no longer read.
"""

from __future__ import annotations

from typing import Any

import voluptuous as vol

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, ServiceCall, callback
from homeassistant.exceptions import ServiceValidationError
from homeassistant.helpers import config_validation as cv

from . import config_writes
from .config_writes import SchooldayValueError
from .const import (
    ATTR_BLOCK,
    ATTR_CALENDAR_FIELD,
    ATTR_COLOR,
    ATTR_DAY,
    ATTR_DONE,
    ATTR_KEYWORDS,
    ATTR_LESSONS,
    ATTR_MEMBER,
    ATTR_NAME,
    ATTR_PERIOD,
    ATTR_PERIODS,
    ATTR_ROOM_FIELD,
    ATTR_STEP,
    ATTR_STEPS,
    ATTR_SUBJECT_FIELD,
    ATTR_WEEKDAY_FIELD,
    CONF_AVATAR,
    CONF_CALENDAR,
    DATA_STORE,
    DOMAIN,
    ROUTINE_BLOCKS,
    SERVICE_REMOVE_MEMBER,
    SERVICE_RESET_ROUTINE,
    SERVICE_SET_CALENDARS,
    SERVICE_SET_DAY,
    SERVICE_SET_LESSON,
    SERVICE_SET_MEMBER,
    SERVICE_SET_PERIODS,
    SERVICE_SET_ROUTINE,
    SERVICE_SET_ROUTINE_STEP,
    SERVICE_SET_SUBJECT_COLOR,
)
from .models import SchooldayConfig
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

_LESSON = vol.Schema(
    {
        vol.Required(ATTR_PERIOD): vol.Coerce(int),
        vol.Optional(ATTR_SUBJECT_FIELD): vol.Any(cv.string, None),
        vol.Optional(ATTR_ROOM_FIELD): vol.Any(cv.string, None),
    }
)
_WEEKDAY = vol.All(vol.Coerce(int), vol.Range(min=0, max=6))

SET_PERIODS_SCHEMA = vol.Schema({vol.Required(ATTR_PERIODS): vol.All(cv.ensure_list, [cv.string])})

SET_LESSON_SCHEMA = vol.Schema(
    {
        vol.Required(ATTR_MEMBER): cv.string,
        vol.Required(ATTR_WEEKDAY_FIELD): _WEEKDAY,
        vol.Required(ATTR_PERIOD): vol.Coerce(int),
        vol.Optional(ATTR_SUBJECT_FIELD): vol.Any(cv.string, None),
        vol.Optional(ATTR_ROOM_FIELD): vol.Any(cv.string, None),
    }
)

SET_DAY_SCHEMA = vol.Schema(
    {
        vol.Required(ATTR_MEMBER): cv.string,
        vol.Required(ATTR_WEEKDAY_FIELD): _WEEKDAY,
        vol.Required(ATTR_LESSONS): vol.All(cv.ensure_list, [_LESSON]),
    }
)

SET_ROUTINE_SCHEMA = vol.Schema(
    {
        vol.Required(ATTR_MEMBER): cv.string,
        vol.Required(ATTR_BLOCK): vol.In(ROUTINE_BLOCKS),
        vol.Required(ATTR_DAY): cv.string,
        vol.Required(ATTR_STEPS): vol.All(cv.ensure_list, [cv.string]),
    }
)

SET_COLOR_SCHEMA = vol.Schema(
    {
        vol.Required(ATTR_SUBJECT_FIELD): cv.string,
        vol.Optional(ATTR_COLOR): vol.Any(cv.string, [vol.Coerce(int)], None),
    }
)

SET_MEMBER_SCHEMA = vol.Schema(
    {
        vol.Optional(ATTR_MEMBER): cv.string,
        vol.Required(ATTR_NAME): cv.string,
        vol.Optional(ATTR_COLOR): vol.Any(cv.string, [vol.Coerce(int)], None),
        vol.Optional(CONF_CALENDAR): cv.string,
        vol.Optional(CONF_AVATAR): cv.string,
    }
)

REMOVE_MEMBER_SCHEMA = vol.Schema({vol.Required(ATTR_MEMBER): cv.string})

SET_CALENDARS_SCHEMA = vol.Schema(
    {
        vol.Optional(ATTR_CALENDAR_FIELD): vol.All(cv.ensure_list, [cv.string]),
        vol.Optional(ATTR_KEYWORDS): vol.All(cv.ensure_list, [cv.string]),
    }
)


def _entry(hass: HomeAssistant) -> ConfigEntry:
    """The single Schoolday config entry."""
    entries = hass.config_entries.async_entries(DOMAIN)
    if not entries:
        raise ServiceValidationError("Schoolday is not set up")
    return entries[0]


@callback
def _write(hass: HomeAssistant, changes: dict[str, Any]) -> None:
    """Merge changed sections into the options and save.

    Merging rather than replacing is what keeps a service that touches one section
    from quietly dropping the others.
    """
    entry = _entry(hass)
    hass.config_entries.async_update_entry(
        entry, options={**dict(entry.options), **changes}
    )


def _config(hass: HomeAssistant) -> SchooldayConfig:
    """The current Schoolday configuration, from the single config entry."""
    entries = hass.config_entries.async_entries(DOMAIN)
    if not entries:
        raise ServiceValidationError("Schoolday is not set up")
    return SchooldayConfig.from_options(entries[0].options)


def _resolve_member_id(hass: HomeAssistant, value: str) -> str:
    """Accept either a member id or a member name, so scripts stay readable."""
    config = _config(hass)
    member = config.member_by_id(value) or config.member_by_name(value)
    if member is None:
        known = ", ".join(m.name for m in config.members) or "none configured"
        raise ServiceValidationError(
            f"No Schoolday family member matches '{value}'. Known members: {known}"
        )
    return member.id


@callback
def async_register_services(hass: HomeAssistant) -> None:
    """Register Schoolday's services, once per Home Assistant run."""
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

    # --- the configuration itself ------------------------------------------

    def _options(call: ServiceCall) -> dict[str, Any]:
        return dict(_entry(call.hass).options)

    def _apply(call: ServiceCall, changes: dict[str, Any]) -> None:
        """Save, turning a refused value into something the caller can read.

        SchooldayValueError says the household typed something impossible, which is a
        ServiceValidationError — the caller's problem to fix, not a Schoolday bug.
        """
        _write(call.hass, changes)

    def _guard(handler):
        """Run a write on the event loop, and turn a refused value into a message.

        `async def` is not decoration here: Home Assistant runs a synchronous service
        handler in a worker thread, and `async_update_entry` may only be touched from
        the event loop. A plain `def` writes the configuration from the wrong thread.

        SchooldayValueError means the household typed something impossible, which is a
        ServiceValidationError — the caller's problem to fix, not a Schoolday bug.
        """

        async def wrapped(call: ServiceCall) -> None:
            try:
                handler(call)
            except SchooldayValueError as err:
                raise ServiceValidationError(str(err)) from err

        return wrapped

    @_guard
    def _set_periods(call: ServiceCall) -> None:
        _apply(call, config_writes.set_periods(_options(call), call.data[ATTR_PERIODS]))

    @_guard
    def _set_lesson(call: ServiceCall) -> None:
        _apply(
            call,
            config_writes.set_lesson(
                _options(call),
                _resolve_member_id(hass, call.data[ATTR_MEMBER]),
                call.data[ATTR_WEEKDAY_FIELD],
                call.data[ATTR_PERIOD],
                call.data.get(ATTR_SUBJECT_FIELD),
                call.data.get(ATTR_ROOM_FIELD),
            ),
        )

    @_guard
    def _set_day(call: ServiceCall) -> None:
        _apply(
            call,
            config_writes.set_day(
                _options(call),
                _resolve_member_id(hass, call.data[ATTR_MEMBER]),
                call.data[ATTR_WEEKDAY_FIELD],
                call.data[ATTR_LESSONS],
            ),
        )

    @_guard
    def _set_routine(call: ServiceCall) -> None:
        _apply(
            call,
            config_writes.set_routine(
                _options(call),
                _resolve_member_id(hass, call.data[ATTR_MEMBER]),
                call.data[ATTR_BLOCK],
                call.data[ATTR_DAY],
                call.data[ATTR_STEPS],
            ),
        )

    @_guard
    def _set_color(call: ServiceCall) -> None:
        _apply(
            call,
            config_writes.set_subject_color(
                _options(call), call.data[ATTR_SUBJECT_FIELD], call.data.get(ATTR_COLOR)
            ),
        )

    @_guard
    def _set_member(call: ServiceCall) -> None:
        # Only an existing member is resolved by name; a new one is being named now.
        wanted = call.data.get(ATTR_MEMBER)
        changes, _member_id = config_writes.set_member(
            _options(call),
            _resolve_member_id(hass, wanted) if wanted else None,
            call.data[ATTR_NAME],
            call.data.get(ATTR_COLOR),
            call.data.get(CONF_CALENDAR),
            call.data.get(CONF_AVATAR),
        )
        _apply(call, changes)

    @_guard
    def _remove_member(call: ServiceCall) -> None:
        _apply(
            call,
            config_writes.remove_member(
                _options(call), _resolve_member_id(hass, call.data[ATTR_MEMBER])
            ),
        )

    @_guard
    def _set_calendars(call: ServiceCall) -> None:
        _apply(
            call,
            config_writes.set_calendars(
                _options(call),
                call.data.get(ATTR_CALENDAR_FIELD),
                call.data.get(ATTR_KEYWORDS),
            ),
        )

    for service, handler, schema in (
        (SERVICE_SET_PERIODS, _set_periods, SET_PERIODS_SCHEMA),
        (SERVICE_SET_LESSON, _set_lesson, SET_LESSON_SCHEMA),
        (SERVICE_SET_DAY, _set_day, SET_DAY_SCHEMA),
        (SERVICE_SET_ROUTINE, _set_routine, SET_ROUTINE_SCHEMA),
        (SERVICE_SET_SUBJECT_COLOR, _set_color, SET_COLOR_SCHEMA),
        (SERVICE_SET_MEMBER, _set_member, SET_MEMBER_SCHEMA),
        (SERVICE_REMOVE_MEMBER, _remove_member, REMOVE_MEMBER_SCHEMA),
        (SERVICE_SET_CALENDARS, _set_calendars, SET_CALENDARS_SCHEMA),
    ):
        hass.services.async_register(DOMAIN, service, handler, schema=schema)
