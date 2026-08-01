"""Typed view over the config entry options.

The config entry options are the single source of truth for Hearth's configuration.
This module is the only place that knows their raw shape; everything else works with
:class:`Member` and :class:`HearthConfig`.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any

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
    CONF_ROUTINES,
    CONF_SHARED,
    CONF_SHARED_CALENDARS,
    CONF_SHARED_TODO_LISTS,
    CONF_TODO_LISTS,
    DEFAULT_COLORS,
    ROUTINE_BLOCKS,
)


def steps_from_text(text: str | None) -> list[str]:
    """Parse a multi-line options field into routine steps, one per line."""
    if not text:
        return []
    return [line.strip() for line in text.splitlines() if line.strip()]


def text_from_steps(steps: list[str] | None) -> str:
    """Render steps back into the multi-line field the options flow shows."""
    return "\n".join(steps or [])


def color_to_hex(value: Any) -> str | None:
    """Normalise a colour to ``#rrggbb``.

    ColorRGBSelector yields ``[r, g, b]``; hand-written options may already be hex.
    """
    if value is None:
        return None
    if isinstance(value, str):
        text = value.strip()
        return text if text.startswith("#") else f"#{text}"
    if isinstance(value, (list, tuple)) and len(value) == 3:
        return "#{:02x}{:02x}{:02x}".format(*(int(component) for component in value))
    return None


def hex_to_rgb(value: str | None) -> list[int] | None:
    """Turn ``#rrggbb`` back into ``[r, g, b]`` for ColorRGBSelector."""
    if not value:
        return None
    text = value.lstrip("#")
    if len(text) != 6:
        return None
    try:
        return [int(text[index : index + 2], 16) for index in (0, 2, 4)]
    except ValueError:
        return None


@dataclass(slots=True)
class Member:
    """One family member."""

    id: str
    name: str
    color: str
    avatar: str | None = None
    person: str | None = None
    calendars: list[str] = field(default_factory=list)
    todo_lists: list[str] = field(default_factory=list)
    points_entity: str | None = None
    order: int = 0

    @classmethod
    def from_dict(cls, data: dict[str, Any], index: int = 0) -> Member:
        """Build a member from its stored representation."""
        return cls(
            id=data[CONF_MEMBER_ID],
            name=data[CONF_NAME],
            color=color_to_hex(data.get(CONF_COLOR))
            or DEFAULT_COLORS[index % len(DEFAULT_COLORS)],
            avatar=data.get(CONF_AVATAR) or None,
            person=data.get(CONF_PERSON) or None,
            calendars=list(data.get(CONF_CALENDARS) or []),
            todo_lists=list(data.get(CONF_TODO_LISTS) or []),
            points_entity=data.get(CONF_POINTS_ENTITY) or None,
            order=int(data.get(CONF_ORDER, index)),
        )

    def as_card_dict(self) -> dict[str, Any]:
        """Shape handed to the Lovelace cards via the board sensor's attributes."""
        return {
            "id": self.id,
            "name": self.name,
            "color": self.color,
            "avatar": self.avatar,
            "person": self.person,
            "calendars": self.calendars,
            "todo_lists": self.todo_lists,
            "order": self.order,
        }

    @property
    def tracked_entities(self) -> list[str]:
        """Entities whose state changes should refresh this member's sensor."""
        entities = [*self.todo_lists]
        if self.person:
            entities.append(self.person)
        if self.points_entity:
            entities.append(self.points_entity)
        return entities


@dataclass(slots=True)
class Routine:
    """One member's steps for one block, keyed by weekday (0 = Monday).

    The school timetable is not read from anywhere: it is stable for a school
    year, so "Tuesday is PE" is encoded once as Tuesday's steps.
    """

    by_weekday: dict[int, list[str]] = field(default_factory=dict)

    @classmethod
    def from_dict(cls, data: dict[str, Any] | None) -> Routine:
        """Build from the stored ``{"0": ["step", ...]}`` shape."""
        by_weekday: dict[int, list[str]] = {}
        for key, steps in (data or {}).items():
            try:
                weekday = int(key)
            except (TypeError, ValueError):
                continue
            if 0 <= weekday <= 6 and steps:
                by_weekday[weekday] = [str(step) for step in steps]
        return cls(by_weekday=by_weekday)

    def steps_for(self, weekday: int) -> list[str]:
        """Steps for a given weekday, empty when nothing is planned."""
        return self.by_weekday.get(weekday, [])

    @property
    def is_empty(self) -> bool:
        """True when no weekday has any step."""
        return not any(self.by_weekday.values())


@dataclass(slots=True)
class HearthConfig:
    """The full Hearth configuration."""

    members: list[Member] = field(default_factory=list)
    shared_calendars: list[str] = field(default_factory=list)
    shared_todo_lists: list[str] = field(default_factory=list)
    readonly_calendars: list[str] = field(default_factory=list)
    #: member id -> block -> Routine
    routines: dict[str, dict[str, Routine]] = field(default_factory=dict)

    @classmethod
    def from_options(cls, options: dict[str, Any]) -> HearthConfig:
        """Build the configuration from a config entry's options."""
        raw_members = options.get(CONF_MEMBERS) or []
        members = [Member.from_dict(item, index) for index, item in enumerate(raw_members)]
        members.sort(key=lambda member: (member.order, member.name))

        raw_routines = options.get(CONF_ROUTINES) or {}
        routines = {
            member.id: {
                block: Routine.from_dict((raw_routines.get(member.id) or {}).get(block))
                for block in ROUTINE_BLOCKS
            }
            for member in members
        }

        shared = options.get(CONF_SHARED) or {}
        return cls(
            members=members,
            shared_calendars=list(shared.get(CONF_SHARED_CALENDARS) or []),
            shared_todo_lists=list(shared.get(CONF_SHARED_TODO_LISTS) or []),
            readonly_calendars=list(shared.get(CONF_READONLY_CALENDARS) or []),
            routines=routines,
        )

    def routine(self, member_id: str, block: str) -> Routine:
        """A member's routine for a block, empty when never configured."""
        return (self.routines.get(member_id) or {}).get(block) or Routine()

    def member_by_id(self, member_id: str) -> Member | None:
        """Look up a member by id."""
        return next((m for m in self.members if m.id == member_id), None)

    def member_by_name(self, name: str) -> Member | None:
        """Look up a member by name, case-insensitively."""
        wanted = name.strip().casefold()
        return next((m for m in self.members if m.name.casefold() == wanted), None)

    @property
    def has_routines(self) -> bool:
        """True when at least one member has at least one step configured."""
        return any(
            not routine.is_empty
            for blocks in self.routines.values()
            for routine in blocks.values()
        )

    @property
    def all_calendars(self) -> list[str]:
        """Every calendar Hearth knows about, de-duplicated, order preserved."""
        seen: dict[str, None] = {}
        for entity_id in [
            *self.shared_calendars,
            *(entity for member in self.members for entity in member.calendars),
        ]:
            seen.setdefault(entity_id, None)
        return list(seen)
