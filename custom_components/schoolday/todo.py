"""One homework list per child.

The timetable says when, the routines say which rituals — and until now nothing said
what actually has to be done. This is that.

Deliberately a Home Assistant `todo` list rather than an attribute of Schoolday's own.
Home Assistant already has a shape for "things still to do", and it arrives with a
voice interface, a card, a calendar view and an API that Schoolday would otherwise
have to invent worse versions of. What Schoolday adds is whose list it is, and the
sorting a school evening actually wants: unfinished first, soonest first.
"""

from __future__ import annotations

from datetime import date, datetime
from typing import Any

from homeassistant.components.todo import (
    TodoItem,
    TodoItemStatus,
    TodoListEntity,
    TodoListEntityFeature,
)
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.device_registry import DeviceEntryType, DeviceInfo
from homeassistant.helpers.dispatcher import async_dispatcher_connect
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback
from homeassistant.util.ulid import ulid_now

from .const import (
    ATTR_DUE,
    ATTR_HOMEWORK,
    ATTR_HOMEWORK_OPEN,
    ATTR_MEMBER_ID,
    ATTR_SUMMARY,
    ATTR_UID,
    DATA_HOMEWORK,
    DOMAIN,
    SIGNAL_HOMEWORK_UPDATED,
    VERSION,
)
from .models import Member, SchooldayConfig
from .sensor import homework_unique_id
from .store import HomeworkStore


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    """Set up one homework list per family member."""
    config = SchooldayConfig.from_options(entry.options)
    store: HomeworkStore = hass.data[DATA_HOMEWORK]
    async_add_entities(
        SchooldayHomeworkList(entry, member, store) for member in config.members
    )


def _due_string(due: date | datetime | None) -> str | None:
    """A due date as `YYYY-MM-DD`.

    Homework is due on a day, not at a time — "by Tuesday" is what a teacher says — so
    a datetime is taken down to its date rather than stored and then rendered back into
    a precision nobody meant.
    """
    if due is None:
        return None
    return (due.date() if isinstance(due, datetime) else due).isoformat()


class SchooldayHomeworkList(TodoListEntity):
    """One child's homework."""

    _attr_has_entity_name = True
    _attr_should_poll = False
    _attr_icon = "mdi:notebook-edit-outline"
    _attr_translation_key = "homework"
    _attr_supported_features = (
        TodoListEntityFeature.CREATE_TODO_ITEM
        | TodoListEntityFeature.UPDATE_TODO_ITEM
        | TodoListEntityFeature.DELETE_TODO_ITEM
        | TodoListEntityFeature.SET_DUE_DATE_ON_ITEM
        | TodoListEntityFeature.SET_DESCRIPTION_ON_ITEM
    )

    def __init__(
        self, entry: ConfigEntry, member: Member, store: HomeworkStore
    ) -> None:
        """Initialise one member's homework list."""
        self._member = member
        self._store = store
        self._attr_unique_id = homework_unique_id(entry, member.id)
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
        """Redraw when the list changes, whoever changed it."""
        self.async_on_remove(
            async_dispatcher_connect(
                self.hass, SIGNAL_HOMEWORK_UPDATED, self._handle_change
            )
        )

    @callback
    def _handle_change(self, _event: Any = None) -> None:
        self.async_write_ha_state()

    @property
    def todo_items(self) -> list[TodoItem]:
        """This member's homework, unfinished first and then by due date."""
        return [
            TodoItem(
                uid=uid,
                summary=str(item.get("summary") or ""),
                status=(
                    TodoItemStatus.COMPLETED
                    if item.get("done")
                    else TodoItemStatus.NEEDS_ACTION
                ),
                due=date.fromisoformat(str(item["due"])) if item.get("due") else None,
                description=item.get("description") or None,
            )
            for uid, item in self._store.items(self._member.id)
        ]

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        """The list itself, so a card can draw it without a service round trip.

        Every other Schoolday card reads what it draws off an entity's attributes;
        making this one alone go through `todo.get_items` would buy nothing and cost
        the card an await on every render.
        """
        return {
            ATTR_MEMBER_ID: self._member.id,
            ATTR_HOMEWORK_OPEN: self._store.open_count(self._member.id),
            ATTR_HOMEWORK: [
                {
                    ATTR_UID: uid,
                    ATTR_SUMMARY: item.get("summary"),
                    ATTR_DUE: item.get("due"),
                    "done": bool(item.get("done")),
                }
                for uid, item in self._store.items(self._member.id)
            ],
        }

    async def async_create_todo_item(self, item: TodoItem) -> None:
        """Add a piece of homework."""
        await self._store.async_add(
            self._member.id,
            ulid_now(),
            item.summary or "",
            _due_string(item.due),
            item.description,
            item.status == TodoItemStatus.COMPLETED,
        )

    async def async_update_todo_item(self, item: TodoItem) -> None:
        """Change one, or tick it off."""
        await self._store.async_update(
            self._member.id,
            item.uid or "",
            item.summary,
            _due_string(item.due),
            item.description,
            None if item.status is None else item.status == TodoItemStatus.COMPLETED,
            # An update that carries no date is a date being cleared: Home Assistant
            # sends the whole item every time, so a missing due is a deletion rather
            # than an omission.
            clear_due=item.due is None,
        )

    async def async_delete_todo_items(self, uids: list[str]) -> None:
        """Take homework off the list for good."""
        await self._store.async_remove(self._member.id, uids)
