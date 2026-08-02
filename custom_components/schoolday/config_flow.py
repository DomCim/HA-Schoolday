"""Config and options flow for Schoolday.

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
    CONF_CALENDAR,
    CONF_CARE_KEYWORDS,
    CONF_COLOR,
    CONF_MEMBER_ID,
    CONF_MEMBERS,
    CONF_NAME,
    CONF_ORDER,
    CONF_PERIODS,
    CONF_ROUTINES,
    CONF_SCHOOL_CALENDARS,
    CONF_TIMETABLE,
    DEFAULT_COLORS,
    DOMAIN,
    ROUTINE_BLOCKS,
    ROUTINE_EXTRA_KEYS,
    SUGGESTED_CARE_KEYWORDS,
    WEEKDAYS,
)
from .models import (
    InvalidPeriod,
    Lesson,
    Timetable,
    color_to_hex,
    hex_to_rgb,
    lessons_from_text,
    periods_from_text,
    steps_from_text,
    text_from_lessons,
    text_from_periods,
    text_from_steps,
    unify_subjects,
)


class SchooldayConfigFlow(ConfigFlow, domain=DOMAIN):
    """Create the single Schoolday entry. Everything else happens in the options flow."""

    VERSION = 1

    async def async_step_user(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Confirm creation. `single_config_entry` in the manifest guards duplicates."""
        if user_input is not None:
            return self.async_create_entry(
                title="Schoolday",
                data={},
                options={CONF_MEMBERS: []},
            )
        return self.async_show_form(step_id="user", data_schema=vol.Schema({}))

    @staticmethod
    @callback
    def async_get_options_flow(config_entry: Any) -> OptionsFlow:
        """Return the options flow."""
        return SchooldayOptionsFlow()


class SchooldayOptionsFlow(OptionsFlow):
    """Add, edit and remove family members, their routines and their timetable."""

    def __init__(self) -> None:
        """Initialise per-flow state."""
        self._member_id: str | None = None
        self._block: str | None = None

    # --- helpers ------------------------------------------------------------

    @property
    def _members(self) -> list[dict[str, Any]]:
        return list(self.config_entry.options.get(CONF_MEMBERS) or [])

    @property
    def _routines(self) -> dict[str, Any]:
        return dict(self.config_entry.options.get(CONF_ROUTINES) or {})

    @property
    def _school_calendars(self) -> list[str]:
        return list(self.config_entry.options.get(CONF_SCHOOL_CALENDARS) or [])

    @property
    def _care_keywords(self) -> list[str]:
        return list(self.config_entry.options.get(CONF_CARE_KEYWORDS) or [])

    @property
    def _timetable(self) -> Timetable:
        return Timetable.from_dict(self.config_entry.options.get(CONF_TIMETABLE))

    def _member_labels(self) -> list[selector.SelectOptionDict]:
        return [
            selector.SelectOptionDict(
                value=member[CONF_MEMBER_ID], label=member[CONF_NAME]
            )
            for member in self._members
        ]

    def _persist(self, **changes: Any) -> None:
        """Write the options back, carrying every section that is not being changed.

        Every section has to be listed: `async_update_entry` replaces the options
        wholesale, so anything left out here would be silently dropped.
        """
        options: dict[str, Any] = {
            CONF_MEMBERS: self._members,
            CONF_ROUTINES: self._routines,
            CONF_TIMETABLE: self._timetable.as_options(),
            CONF_SCHOOL_CALENDARS: self._school_calendars,
            CONF_CARE_KEYWORDS: self._care_keywords,
        }
        options.update(changes)
        self.hass.config_entries.async_update_entry(self.config_entry, options=options)

    async def _apply(self, **changes: Any) -> ConfigFlowResult:
        """Persist the change and return to the menu.

        Deliberately not `async_create_entry`: that ends the flow, which meant a
        household of five needed sixteen separate trips through Configure. Writing
        the entry directly keeps one dialog open for the whole session, and every
        step is saved the moment it is made — closing the dialog loses nothing.
        """
        self._persist(**changes)
        return await self.async_step_init()

    def _member_schema(self) -> vol.Schema:
        return vol.Schema(
            {
                vol.Required(CONF_NAME): selector.TextSelector(),
                vol.Required(CONF_COLOR): selector.ColorRGBSelector(),
                vol.Optional(CONF_CALENDAR): selector.EntitySelector(
                    selector.EntitySelectorConfig(domain="calendar")
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
            options += ["edit_member", "remove_member", "routines", "timetable"]
        options.append("done")
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
                key: steps
                for key in (*WEEKDAYS, *ROUTINE_EXTRA_KEYS)
                if (steps := steps_from_text(user_input.get(key)))
            }
            routines[self._member_id] = current
            self._persist(**{CONF_ROUTINES: routines})
            return await self.async_step_routines()

        stored = current.get(self._block) or {}
        keys = (*WEEKDAYS, *ROUTINE_EXTRA_KEYS)
        suggested = {key: text_from_steps(stored.get(key)) for key in keys}

        schema = vol.Schema(
            {
                vol.Optional(key): selector.TextSelector(
                    selector.TextSelectorConfig(multiline=True)
                )
                for key in keys
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

    # --- timetable ----------------------------------------------------------

    async def async_step_timetable(
        self, _user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """The timetable menu.

        Lessons only become editable once the times exist, which is also the order
        the household thinks in: first when a period is, then what is in it.
        """
        timetable = self._timetable
        options = ["timetable_times"]
        if timetable.periods:
            options.append("timetable_lessons")
        if timetable.subjects:
            options.append("timetable_colors")
        options += ["timetable_calendars", "init"]
        return self.async_show_menu(step_id="timetable", menu_options=options)

    async def async_step_timetable_times(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Edit the lesson times, one ``HH:MM-HH:MM`` per line.

        Breaks are not asked for: they are the gaps between these times, and the
        cards draw them from there.
        """
        timetable = self._timetable

        if user_input is not None:
            try:
                periods = periods_from_text(user_input.get(CONF_PERIODS))
            except InvalidPeriod as err:
                return self.async_show_form(
                    step_id="timetable_times",
                    data_schema=self.add_suggested_values_to_schema(
                        self._times_schema(), {CONF_PERIODS: user_input.get(CONF_PERIODS)}
                    ),
                    errors={CONF_PERIODS: "invalid_period"},
                    description_placeholders={"line": err.line},
                )
            timetable.periods = periods
            self._persist(**{CONF_TIMETABLE: timetable.as_options()})
            return await self.async_step_timetable()

        return self.async_show_form(
            step_id="timetable_times",
            data_schema=self.add_suggested_values_to_schema(
                self._times_schema(),
                {CONF_PERIODS: text_from_periods(timetable.periods)},
            ),
        )

    @staticmethod
    def _times_schema() -> vol.Schema:
        return vol.Schema(
            {
                vol.Optional(CONF_PERIODS): selector.TextSelector(
                    selector.TextSelectorConfig(multiline=True)
                )
            }
        )

    async def async_step_timetable_calendars(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Name the calendars that close the school.

        A timetable repeats forever; holidays do not, and they are the one thing it
        cannot know by itself. Any event running on one of these calendars means today
        has no school: the lessons stay on the card as the plan they are, but today's
        lessons, the running lesson and the sensor's state all go quiet.
        """
        if user_input is not None:
            self._persist(
                **{
                    CONF_SCHOOL_CALENDARS: list(
                        user_input.get(CONF_SCHOOL_CALENDARS) or []
                    ),
                    CONF_CARE_KEYWORDS: steps_from_text(
                        user_input.get(CONF_CARE_KEYWORDS)
                    ),
                }
            )
            return await self.async_step_timetable()

        schema = vol.Schema(
            {
                vol.Optional(CONF_SCHOOL_CALENDARS): selector.EntitySelector(
                    selector.EntitySelectorConfig(domain="calendar", multiple=True)
                ),
                vol.Optional(CONF_CARE_KEYWORDS): selector.TextSelector(
                    selector.TextSelectorConfig(multiline=True)
                ),
            }
        )
        # Suggest a word only in a language we ship strings for. Every country calls
        # holiday care something else, and a wrong guess is worse than an empty field.
        stored = self._care_keywords
        keywords = (
            text_from_steps(stored)
            if stored
            else SUGGESTED_CARE_KEYWORDS.get(
                (self.hass.config.language or "en").split("-")[0], ""
            )
        )
        return self.async_show_form(
            step_id="timetable_calendars",
            data_schema=self.add_suggested_values_to_schema(
                schema,
                {
                    CONF_SCHOOL_CALENDARS: self._school_calendars,
                    CONF_CARE_KEYWORDS: keywords,
                },
            ),
        )

    async def async_step_timetable_lessons(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Pick whose timetable to edit."""
        if user_input is not None:
            self._member_id = user_input[CONF_MEMBER_ID]
            return await self.async_step_timetable_week()

        return self.async_show_form(
            step_id="timetable_lessons",
            data_schema=vol.Schema(
                {
                    vol.Required(CONF_MEMBER_ID): selector.SelectSelector(
                        selector.SelectSelectorConfig(options=self._member_labels())
                    )
                }
            ),
        )

    async def async_step_timetable_week(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Edit one member's whole week, one field per weekday.

        One lesson per line, in period order — the same shape as the routine steps,
        because it is the least fiddly thing to type on the phone in your hand.
        """
        member = next(
            (m for m in self._members if m[CONF_MEMBER_ID] == self._member_id), None
        )
        if member is None:
            return self.async_abort(reason="member_not_found")

        timetable = self._timetable

        if user_input is not None:
            week: dict[int, list[Lesson]] = {}
            for day in WEEKDAYS:
                lessons = lessons_from_text(user_input.get(day), len(timetable.periods))
                if lessons:
                    week[int(day)] = lessons
            unify_subjects(week)
            if week:
                timetable.lessons[self._member_id] = week
            else:
                timetable.lessons.pop(self._member_id, None)
            self._persist(**{CONF_TIMETABLE: timetable.as_options()})
            return await self.async_step_timetable()

        stored = timetable.week(self._member_id)
        suggested = {day: text_from_lessons(stored.get(int(day), [])) for day in WEEKDAYS}

        schema = vol.Schema(
            {
                vol.Optional(day): selector.TextSelector(
                    selector.TextSelectorConfig(multiline=True)
                )
                for day in WEEKDAYS
            }
        )
        return self.async_show_form(
            step_id="timetable_week",
            data_schema=self.add_suggested_values_to_schema(schema, suggested),
            description_placeholders={
                "name": member[CONF_NAME],
                "periods": "\n".join(
                    f"{period.index}. {period.start}–{period.end}"
                    for period in timetable.periods
                ),
            },
        )

    async def async_step_timetable_colors(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Recolour the subjects.

        Every subject already has a colour, derived from its name, so this step is
        only ever a correction — which is why it offers the current colour as the
        suggested value rather than an empty field.
        """
        timetable = self._timetable
        subjects = timetable.subjects
        if not subjects:
            return await self.async_step_timetable()

        if user_input is not None:
            timetable.colors = {
                subject: hex_value
                for subject in subjects
                if (hex_value := color_to_hex(user_input.get(subject)))
            }
            self._persist(**{CONF_TIMETABLE: timetable.as_options()})
            return await self.async_step_timetable()

        schema = vol.Schema(
            {
                vol.Optional(subject): selector.ColorRGBSelector()
                for subject in subjects
            }
        )
        suggested = {
            subject: hex_to_rgb(timetable.color(subject)) for subject in subjects
        }
        return self.async_show_form(
            step_id="timetable_colors",
            data_schema=self.add_suggested_values_to_schema(schema, suggested),
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
            timetable = self._timetable
            for member_id in doomed:
                timetable.lessons.pop(member_id, None)
            return await self._apply(
                **{
                    CONF_MEMBERS: remaining,
                    CONF_ROUTINES: routines,
                    CONF_TIMETABLE: timetable.as_options(),
                }
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
