"""The Schoolday integration.

Schoolday owns two things Home Assistant cannot hold for it: the school timetable and
the daily routines. Both are typed in once — a timetable is fixed for a school year —
published as sensor attributes for automations, and rendered by the Lovelace cards this
integration serves itself.
"""

from __future__ import annotations

import logging
from pathlib import Path
from typing import Any

from homeassistant.components import frontend
from homeassistant.components.http import StaticPathConfig
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import Platform
from homeassistant.core import HomeAssistant
from homeassistant.helpers.event import async_track_time_change

from .const import (
    DATA_ABSENCE,
    DATA_FRONTEND_REGISTERED,
    DATA_HISTORY,
    DATA_HOMEWORK,
    DATA_STORE,
    FRONTEND_DIR,
    FRONTEND_URL_BASE,
    PANEL_FILENAME,
    VERSION,
)
from .services import async_register_services
from .store import AbsenceStore, HistoryStore, HomeworkStore, RoutineStore

_LOGGER = logging.getLogger(__name__)

PLATFORMS: list[Platform] = [Platform.SENSOR, Platform.SWITCH, Platform.TODO]


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up Schoolday from a config entry."""
    await _async_register_frontend(hass)

    # Survives reloads: the routine ticks belong to the day, not to the entry.
    if DATA_STORE not in hass.data:
        store = RoutineStore(hass)
        await store.async_load()
        hass.data[DATA_STORE] = store

    if DATA_ABSENCE not in hass.data:
        absence = AbsenceStore(hass)
        await absence.async_load()
        hass.data[DATA_ABSENCE] = absence

    if DATA_HOMEWORK not in hass.data:
        homework = HomeworkStore(hass)
        await homework.async_load()
        hass.data[DATA_HOMEWORK] = homework

    if DATA_HISTORY not in hass.data:
        history = HistoryStore(hass)
        await history.async_load()
        hass.data[DATA_HISTORY] = history

    async_register_services(hass)
    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    entry.async_on_unload(entry.add_update_listener(_async_options_updated))

    # Correctness does not depend on any of these — a stale day already reads as
    # "nothing done", an absence that has run out already reads as over, and a day that
    # has fallen out of the history window is already left out of the figures. They are
    # here so the wall panel clears itself overnight, unattended.
    async def _handle_midnight(_now: Any) -> None:
        await hass.data[DATA_STORE].async_handle_midnight()
        await hass.data[DATA_ABSENCE].async_handle_midnight()
        await hass.data[DATA_HOMEWORK].async_handle_midnight()
        await hass.data[DATA_HISTORY].async_handle_midnight()

    entry.async_on_unload(
        async_track_time_change(hass, _handle_midnight, hour=0, minute=0, second=10)
    )
    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload a config entry.

    The frontend registration is intentionally left in place: static paths cannot be
    unregistered, and the bundle is harmless when no entry is loaded.
    """
    return await hass.config_entries.async_unload_platforms(entry, PLATFORMS)


async def _async_options_updated(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Reload the entry so member changes take effect immediately."""
    await hass.config_entries.async_reload(entry.entry_id)


async def _async_register_frontend(hass: HomeAssistant) -> None:
    """Serve the card bundle and add it to the frontend, once per Home Assistant run."""
    if hass.data.get(DATA_FRONTEND_REGISTERED):
        return

    panel_dir = Path(__file__).parent / FRONTEND_DIR
    if not (panel_dir / PANEL_FILENAME).is_file():
        _LOGGER.error(
            "Schoolday's card bundle is missing at %s. The integration will load, but no "
            "Schoolday cards will be available. Run 'npm run build' and reinstall, or "
            "download a release that ships the built bundle",
            panel_dir / PANEL_FILENAME,
        )
        return

    await hass.http.async_register_static_paths(
        [
            StaticPathConfig(
                FRONTEND_URL_BASE,
                str(panel_dir),
                # No long-lived cache: the version query string only changes on release,
                # while the file changes on every local rebuild.
                False,
            )
        ]
    )
    frontend.add_extra_js_url(hass, f"{FRONTEND_URL_BASE}/{PANEL_FILENAME}?v={VERSION}")
    hass.data[DATA_FRONTEND_REGISTERED] = True
    _LOGGER.debug("Registered Schoolday frontend from %s", panel_dir)
