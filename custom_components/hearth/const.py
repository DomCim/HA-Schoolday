"""Constants for the Hearth integration."""

from __future__ import annotations

from typing import Final

DOMAIN: Final = "hearth"

# Keep in sync with manifest.json, package.json and src/lib/const.ts.
VERSION: Final = "0.1.0"

# Where the bundled Lovelace cards are served from.
FRONTEND_URL_BASE: Final = "/hearth-frontend"
FRONTEND_DIR: Final = "frontend"
PANEL_FILENAME: Final = "hearth-panel.js"

# hass.data key guarding one-time frontend registration.
DATA_FRONTEND_REGISTERED: Final = f"{DOMAIN}_frontend_registered"

# --- Options keys -----------------------------------------------------------

CONF_MEMBERS: Final = "members"
CONF_SHARED: Final = "shared"

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

ATTR_MEMBER_ID: Final = "member_id"
ATTR_MEMBERS: Final = "members"
ATTR_COLOR: Final = "color"
ATTR_AVATAR: Final = "avatar"
ATTR_PRESENCE: Final = "presence"
ATTR_POINTS: Final = "points"
ATTR_CALENDARS: Final = "calendars"
ATTR_TODO_LISTS: Final = "todo_lists"
ATTR_VERSION: Final = "version"

# Fallback colour cycle, mirrors DEFAULT_MEMBER_COLORS in src/lib/const.ts.
DEFAULT_COLORS: Final[list[str]] = [
    "#e0603a",
    "#3a86c8",
    "#4f9d69",
    "#c9a227",
    "#8e6bbf",
    "#d1707f",
]
