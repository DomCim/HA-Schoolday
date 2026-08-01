"""The Hearth integration.

Hearth owns almost no data of its own. It stores which family member owns which
calendars and lists, exposes that mapping as sensor attributes, and serves the
Lovelace cards that render it. Everything else lives in the integrations you
already have.
"""

from __future__ import annotations

import logging
from pathlib import Path

from homeassistant.components import frontend
from homeassistant.components.http import StaticPathConfig
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import Platform
from homeassistant.core import HomeAssistant

from .const import (
    DATA_FRONTEND_REGISTERED,
    FRONTEND_DIR,
    FRONTEND_URL_BASE,
    PANEL_FILENAME,
    VERSION,
)

_LOGGER = logging.getLogger(__name__)

PLATFORMS: list[Platform] = [Platform.SENSOR]


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up Hearth from a config entry."""
    await _async_register_frontend(hass)
    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    entry.async_on_unload(entry.add_update_listener(_async_options_updated))
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
            "Hearth's card bundle is missing at %s. The integration will load, but no "
            "Hearth cards will be available. Run 'npm run build' and reinstall, or "
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
    _LOGGER.debug("Registered Hearth frontend from %s", panel_dir)
