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
    CONF_SHARED,
    CONF_SHARED_CALENDARS,
    CONF_SHARED_TODO_LISTS,
    CONF_TODO_LISTS,
    DEFAULT_COLORS,
    DOMAIN,
)
from .models import color_to_hex, hex_to_rgb

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

    # --- helpers ------------------------------------------------------------

    @property
    def _members(self) -> list[dict[str, Any]]:
        return list(self.config_entry.options.get(CONF_MEMBERS) or [])

    @property
    def _shared(self) -> dict[str, Any]:
        return dict(self.config_entry.options.get(CONF_SHARED) or {})

    def _member_labels(self) -> list[selector.SelectOptionDict]:
        return [
            selector.SelectOptionDict(
                value=member[CONF_MEMBER_ID], label=member[CONF_NAME]
            )
            for member in self._members
        ]

    def _save(self, **changes: Any) -> ConfigFlowResult:
        """Persist options and end the flow."""
        options: dict[str, Any] = {
            CONF_MEMBERS: self._members,
            CONF_SHARED: self._shared,
        }
        options.update(changes)
        return self.async_create_entry(title="", data=options)

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
            options += ["edit_member", "remove_member"]
        options.append("shared")
        return self.async_show_menu(step_id="init", menu_options=options)

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
            return self._save(**{CONF_MEMBERS: [*members, member]})

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
            return self._save(
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
            return self._save(**{CONF_MEMBERS: remaining})

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
            return self._save(
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
