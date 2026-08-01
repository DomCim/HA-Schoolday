"""Constants for the Hearth integration."""

from __future__ import annotations

from typing import Final

DOMAIN: Final = "hearth"

# Keep in sync with manifest.json, package.json and src/lib/const.ts.
VERSION: Final = "0.3.0"

# Where the bundled Lovelace cards are served from.
FRONTEND_URL_BASE: Final = "/hearth-frontend"
FRONTEND_DIR: Final = "frontend"
PANEL_FILENAME: Final = "hearth-panel.js"

# hass.data key guarding one-time frontend registration.
DATA_FRONTEND_REGISTERED: Final = f"{DOMAIN}_frontend_registered"

# --- Options keys -----------------------------------------------------------

CONF_MEMBERS: Final = "members"
CONF_SHARED: Final = "shared"
CONF_ROUTINES: Final = "routines"

# Routine blocks. Two is deliberate: a wall panel should show what is due now,
# and "before school" versus "before bed" is the split that actually matters.
BLOCK_MORNING: Final = "morning"
BLOCK_EVENING: Final = "evening"
ROUTINE_BLOCKS: Final[tuple[str, ...]] = (BLOCK_MORNING, BLOCK_EVENING)

# Weekday keys are 0 = Monday, matching datetime.weekday() — and Chores4Kids,
# so the household only has to learn one numbering.
WEEKDAYS: Final[tuple[str, ...]] = ("0", "1", "2", "3", "4", "5", "6")

CONF_MEMBER_ID: Final = "id"
CONF_NAME: Final = "name"
CONF_COLOR: Final = "color"
CONF_AVATAR: Final = "avatar"
CONF_PERSON: Final = "person"
CONF_CALENDARS: Final = "calendars"
CONF_TODO_LISTS: Final = "todo_lists"
CONF_POINTS_ENTITY: Final = "points_entity"
CONF_ORDER: Final = "order"

CONF_SHARED_CALENDARS: Final = "shared_calendars"
CONF_SHARED_TODO_LISTS: Final = "shared_todo_lists"
CONF_READONLY_CALENDARS: Final = "readonly_calendars"

# --- Entity attributes exposed to the cards ---------------------------------

# Marker the cards use to locate the board sensor, so renaming it does not break them.
ATTR_BOARD: Final = "hearth_board"

ATTR_MEMBER_ID: Final = "member_id"
ATTR_MEMBERS: Final = "members"
ATTR_COLOR: Final = "color"
ATTR_AVATAR: Final = "avatar"
ATTR_PRESENCE: Final = "presence"
ATTR_POINTS: Final = "points"
ATTR_CALENDARS: Final = "calendars"
ATTR_TODO_LISTS: Final = "todo_lists"
ATTR_VERSION: Final = "version"
ATTR_ROUTINE_MORNING: Final = "routine_morning"
ATTR_ROUTINE_EVENING: Final = "routine_evening"
ATTR_ROUTINE_BLOCKS: Final = "routine_blocks"

# --- Routine completion state ------------------------------------------------

# Which steps are ticked off today. Deliberately not in the config entry: this
# changes many times a day and would rewrite the configuration each time.
STORAGE_KEY: Final = f"{DOMAIN}.routine_state"
STORAGE_VERSION: Final = 1

DATA_STORE: Final = f"{DOMAIN}_store"
SIGNAL_ROUTINE_UPDATED: Final = f"{DOMAIN}_routine_updated"

SERVICE_SET_ROUTINE_STEP: Final = "set_routine_step"
SERVICE_RESET_ROUTINE: Final = "reset_routine"

ATTR_MEMBER: Final = "member"
ATTR_BLOCK: Final = "block"
ATTR_STEP: Final = "step"
ATTR_DONE: Final = "done"

# Fallback colour cycle, mirrors DEFAULT_MEMBER_COLORS in src/lib/const.ts.
DEFAULT_COLORS: Final[list[str]] = [
    "#e0603a",
    "#3a86c8",
    "#4f9d69",
    "#c9a227",
    "#8e6bbf",
    "#d1707f",
]
