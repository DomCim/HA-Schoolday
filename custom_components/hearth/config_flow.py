"""Config and options flow for Hearth.

The config entry's options are the single source of truth for the family setup.
Changing them reloads the entry, which rebuilds the sensors the cards read.
"""

from __future__ import annotations

from typing import Any

import voluptuous as vol

from homeassistant.config_entries import (
    ConfigFlow,
    ConfigFlowResult,
    OptionsFlow,
)
from homeassistant.core import callback
from homeassistant.helpers import selector
from homeassistant.util.ulid import ulid_now

from .const import (
    ATTR_BLOCK,
    BLOCK_MORNING,
    CONF_AVATAR,
    CONF_CALENDARS,
    CONF_COLOR,
    CONF_MEMBER_ID,
    CONF_MEMBERS,
    CONF_NAME,
    CONF_ORDER,
    CONF_PERSON,
    CONF_POINTS_ENTITY,
    CONF_READONLY_CALENDARS,
    CONF_ROUTINES,
    CONF_SHARED,
    CONF_SHARED_CALENDARS,
    CONF_SHARED_TODO_LISTS,
    CONF_TODO_LISTS,
    DEFAULT_COLORS,
    DOMAIN,
    ROUTINE_BLOCKS,
    WEEKDAYS,
)
from .models import color_to_hex, hex_to_rgb, steps_from_text, text_from_steps

CALENDAR_SELECTOR = selector.EntitySelector(
    selector.EntitySelectorConfig(domain="calendar", multiple=True)
)
TODO_SELECTOR = selector.EntitySelector(
    selector.EntitySelectorConfig(domain="todo", multiple=True)
)


class HearthConfigFlow(ConfigFlow, domain=DOMAIN):
    """Create the single Hearth entry. Everything else happens in the options flow."""

    VERSION = 1

    async def async_step_user(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Confirm creation. `single_config_entry` in the manifest guards duplicates."""
        if user_input is not None:
            return self.async_create_entry(
                title="Hearth",
                data={},
                options={CONF_MEMBERS: [], CONF_SHARED: {}},
            )
        return self.async_show_form(step_id="user", data_schema=vol.Schema({}))

    @staticmethod
    @callback
    def async_get_options_flow(config_entry: Any) -> OptionsFlow:
        """Return the options flow."""
        return HearthOptionsFlow()


class HearthOptionsFlow(OptionsFlow):
    """Add, edit and remove family members, and pick the shared calendars and lists."""

    def __init__(self) -> None:
        """Initialise per-flow state."""
        self._member_id: str | None = None
        self._block: str | None = None

    # --- helpers ------------------------------------------------------------

    @property
    def _members(self) -> list[dict[str, Any]]:
        return list(self.config_entry.options.get(CONF_MEMBERS) or [])

    @property
    def _shared(self) -> dict[str, Any]:
        return dict(self.config_entry.options.get(CONF_SHARED) or {})

    @property
    def _routines(self) -> dict[str, Any]:
        return dict(self.config_entry.options.get(CONF_ROUTINES) or {})

    def _member_labels(self) -> list[selector.SelectOptionDict]:
        return [
            selector.SelectOptionDict(
                value=member[CONF_MEMBER_ID], label=member[CONF_NAME]
            )
            for member in self._members
        ]

    async def _apply(self, **changes: Any) -> ConfigFlowResult:
        """Persist the change and return to the menu.

        Deliberately not `async_create_entry`: that ends the flow, which meant a
        household of five needed sixteen separate trips through Configure. Writing
        the entry directly keeps one dialog open for the whole session, and every
        step is saved the moment it is made — closing the dialog loses nothing.
        """
        options: dict[str, Any] = {
            CONF_MEMBERS: self._members,
            CONF_SHARED: self._shared,
            CONF_ROUTINES: self._routines,
        }
        options.update(changes)
        self.hass.config_entries.async_update_entry(self.config_entry, options=options)
        return await self.async_step_init()

    def _member_schema(self) -> vol.Schema:
        return vol.Schema(
            {
                vol.Required(CONF_NAME): selector.TextSelector(),
                vol.Required(CONF_COLOR): selector.ColorRGBSelector(),
                vol.Optional(CONF_PERSON): selector.EntitySelector(
                    selector.EntitySelectorConfig(domain="person")
                ),
                vol.Optional(CONF_CALENDARS): CALENDAR_SELECTOR,
                vol.Optional(CONF_TODO_LISTS): TODO_SELECTOR,
                vol.Optional(CONF_POINTS_ENTITY): selector.EntitySelector(
                    selector.EntitySelectorConfig(domain="sensor")
                ),
                vol.Optional(CONF_AVATAR): selector.TextSelector(),
            }
        )

    @staticmethod
    def _from_form(user_input: dict[str, Any]) -> dict[str, Any]:
        """Normalise a submitted member form into its stored shape."""
        member = {
            key: value
            for key, value in user_input.items()
            if value not in (None, "", [])
        }
        member[CONF_COLOR] = color_to_hex(user_input.get(CONF_COLOR))
        return member

    # --- menu ---------------------------------------------------------------

    async def async_step_init(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Show the main menu."""
        options = ["add_member"]
        if self._members:
            options += ["edit_member", "remove_member", "routines"]
        options += ["shared", "done"]
        return self.async_show_menu(step_id="init", menu_options=options)

    async def async_step_done(
        self, _user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Close the dialog. Everything was already saved as it was entered."""
        return self.async_create_entry(title="", data=dict(self.config_entry.options))

    # --- routines -----------------------------------------------------------

    async def async_step_routines(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Pick whose routine, and which block, to edit."""
        if user_input is not None:
            self._member_id = user_input[CONF_MEMBER_ID]
            self._block = user_input[ATTR_BLOCK]
            return await self.async_step_routine_steps()

        return self.async_show_form(
            step_id="routines",
            data_schema=vol.Schema(
                {
                    vol.Required(CONF_MEMBER_ID): selector.SelectSelector(
                        selector.SelectSelectorConfig(options=self._member_labels())
                    ),
                    vol.Required(ATTR_BLOCK, default=BLOCK_MORNING): selector.SelectSelector(
                        selector.SelectSelectorConfig(
                            options=list(ROUTINE_BLOCKS),
                            translation_key="routine_block",
                        )
                    ),
                }
            ),
        )

    async def async_step_routine_steps(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Edit one member's steps for one block, one field per weekday."""
        member = next(
            (m for m in self._members if m[CONF_MEMBER_ID] == self._member_id), None
        )
        if member is None or self._block is None:
            return self.async_abort(reason="member_not_found")

        routines = {
            key: dict(value) for key, value in (self._routines or {}).items()
        }
        current = dict(routines.get(self._member_id) or {})

        if user_input is not None:
            # One step per line: the least fiddly way to edit a short list on a
            # phone, and it round-trips exactly.
            current[self._block] = {
                day: steps
                for day in WEEKDAYS
                if (steps := steps_from_text(user_input.get(day)))
            }
            routines[self._member_id] = current
            options: dict[str, Any] = {
                CONF_MEMBERS: self._members,
                CONF_SHARED: self._shared,
                CONF_ROUTINES: routines,
            }
            self.hass.config_entries.async_update_entry(
                self.config_entry, options=options
            )
            return await self.async_step_routines()

        stored = current.get(self._block) or {}
        suggested = {day: text_from_steps(stored.get(day)) for day in WEEKDAYS}

        schema = vol.Schema(
            {
                vol.Optional(day): selector.TextSelector(
                    selector.TextSelectorConfig(multiline=True)
                )
                for day in WEEKDAYS
            }
        )
        return self.async_show_form(
            step_id="routine_steps",
            data_schema=self.add_suggested_values_to_schema(schema, suggested),
            description_placeholders={
                "name": member[CONF_NAME],
                "block": self._block,
            },
        )

    # --- add ----------------------------------------------------------------

    async def async_step_add_member(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Add a family member."""
        members = self._members
        if user_input is not None:
            member = self._from_form(user_input)
            member[CONF_MEMBER_ID] = ulid_now()
            member[CONF_ORDER] = len(members)
            return await self._apply(**{CONF_MEMBERS: [*members, member]})

        suggested = {
            CONF_COLOR: hex_to_rgb(DEFAULT_COLORS[len(members) % len(DEFAULT_COLORS)])
        }
        return self.async_show_form(
            step_id="add_member",
            data_schema=self.add_suggested_values_to_schema(
                self._member_schema(), suggested
            ),
        )

    # --- edit ---------------------------------------------------------------

    async def async_step_edit_member(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Pick the member to edit."""
        if user_input is not None:
            self._member_id = user_input[CONF_MEMBER_ID]
            return await self.async_step_edit_member_details()

        return self.async_show_form(
            step_id="edit_member",
            data_schema=vol.Schema(
                {
                    vol.Required(CONF_MEMBER_ID): selector.SelectSelector(
                        selector.SelectSelectorConfig(options=self._member_labels())
                    )
                }
            ),
        )

    async def async_step_edit_member_details(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Edit the selected member."""
        members = self._members
        current = next(
            (item for item in members if item[CONF_MEMBER_ID] == self._member_id), None
        )
        if current is None:
            return self.async_abort(reason="member_not_found")

        if user_input is not None:
            updated = self._from_form(user_input)
            updated[CONF_MEMBER_ID] = current[CONF_MEMBER_ID]
            updated[CONF_ORDER] = current.get(CONF_ORDER, 0)
            return await self._apply(
                **{
                    CONF_MEMBERS: [
                        updated if item[CONF_MEMBER_ID] == self._member_id else item
                        for item in members
                    ]
                }
            )

        suggested = {key: value for key, value in current.items() if key != CONF_COLOR}
        suggested[CONF_COLOR] = hex_to_rgb(current.get(CONF_COLOR))
        return self.async_show_form(
            step_id="edit_member_details",
            data_schema=self.add_suggested_values_to_schema(
                self._member_schema(), suggested
            ),
            description_placeholders={"name": current[CONF_NAME]},
        )

    # --- remove -------------------------------------------------------------

    async def async_step_remove_member(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Remove one or more members."""
        if user_input is not None:
            doomed = set(user_input.get(CONF_MEMBERS) or [])
            remaining = [
                member
                for member in self._members
                if member[CONF_MEMBER_ID] not in doomed
            ]
            for order, member in enumerate(remaining):
                member[CONF_ORDER] = order
            routines = {
                member_id: value
                for member_id, value in self._routines.items()
                if member_id not in doomed
            }
            return await self._apply(
                **{CONF_MEMBERS: remaining, CONF_ROUTINES: routines}
            )

        return self.async_show_form(
            step_id="remove_member",
            data_schema=vol.Schema(
                {
                    vol.Required(CONF_MEMBERS): selector.SelectSelector(
                        selector.SelectSelectorConfig(
                            options=self._member_labels(), multiple=True
                        )
                    )
                }
            ),
        )

    # --- shared -------------------------------------------------------------

    async def async_step_shared(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Pick calendars and lists that belong to the whole family."""
        if user_input is not None:
            return await self._apply(
                **{
                    CONF_SHARED: {
                        key: list(user_input.get(key) or [])
                        for key in (
                            CONF_SHARED_CALENDARS,
                            CONF_SHARED_TODO_LISTS,
                            CONF_READONLY_CALENDARS,
                        )
                    }
                }
            )

        schema = vol.Schema(
            {
                vol.Optional(CONF_SHARED_CALENDARS): CALENDAR_SELECTOR,
                vol.Optional(CONF_SHARED_TODO_LISTS): TODO_SELECTOR,
                vol.Optional(CONF_READONLY_CALENDARS): CALENDAR_SELECTOR,
            }
        )
        return self.async_show_form(
            step_id="shared",
            data_schema=self.add_suggested_values_to_schema(schema, self._shared),
        )
