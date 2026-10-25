"""Put Schoolday's blueprints where Home Assistant looks for them.

HACS installs `custom_components/schoolday/` and nothing else, so a blueprint shipped
in the repository would only reach a household that found the import button in the
manual. Copying them into the blueprint folder on every start means they are simply
there — and stay in step with the sensors they read after every update.

A copy somebody edited is theirs: it is recognised by no longer matching what was last
written, and left alone. A copy somebody deleted stays deleted.
"""

from __future__ import annotations

import hashlib
import logging
from pathlib import Path
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store

from .const import BLUEPRINT_FOLDER, BLUEPRINT_STORAGE_KEY

_LOGGER = logging.getLogger(__name__)

SOURCE = Path(__file__).parent / "blueprints"


def _digest(content: bytes) -> str:
    return hashlib.sha256(content).hexdigest()


def _install(target_dir: Path, written: dict[str, str]) -> tuple[dict[str, str], bool]:
    """Copy what is new or ours to replace, and say whether a file in use changed.

    Runs in the executor: it is nothing but file I/O.
    """
    target_dir.mkdir(parents=True, exist_ok=True)
    result = dict(written)
    replaced = False
    for source in sorted(SOURCE.glob("*.yaml")):
        content = source.read_bytes()
        new = _digest(content)
        target = target_dir / source.name
        if target.exists():
            current = _digest(target.read_bytes())
            if current == new:
                result[source.name] = new
                continue
            if current != written.get(source.name):
                _LOGGER.info(
                    "Leaving %s as it is: it was changed after Schoolday wrote it", target
                )
                continue
            replaced = True
        elif source.name in written:
            # Written once and gone since: somebody deleted it on purpose.
            continue
        target.write_bytes(content)
        result[source.name] = new
    return result, replaced


async def async_install_blueprints(hass: HomeAssistant) -> None:
    """Copy the blueprints into `blueprints/automation/schoolday/`."""
    store: Store[dict[str, Any]] = Store(hass, 1, BLUEPRINT_STORAGE_KEY)
    data = await store.async_load() or {}
    written: dict[str, str] = dict(data.get("files") or {})
    target_dir = Path(hass.config.path("blueprints", "automation", BLUEPRINT_FOLDER))
    try:
        result, replaced = await hass.async_add_executor_job(
            _install, target_dir, written
        )
    except OSError as err:
        # A read-only config folder must not keep the integration from loading.
        _LOGGER.warning("Could not install Schoolday's blueprints: %s", err)
        return
    if result != written:
        await store.async_save({"files": result})
    # Automations built on a blueprint read it when they load, which on a start after
    # an update may already have happened with the old copy.
    if replaced and hass.services.has_service("automation", "reload"):
        await hass.services.async_call("automation", "reload", blocking=False)
