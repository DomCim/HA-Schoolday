"""Which routine steps are ticked off today.

Kept out of the config entry on purpose: this changes many times a day, and
writing it there would rewrite the household's configuration every time a child
taps a step.

The reset is implicit. Nothing has to run at midnight for correctness — the
stored date is compared against today on every read, and a stale day reads as
"nothing done yet". The midnight listener in sensor.py exists only so the wall
panel visibly clears without anyone touching it.
"""

from __future__ import annotations

from datetime import date
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers.dispatcher import async_dispatcher_send
from homeassistant.helpers.storage import Store

from .const import SIGNAL_ROUTINE_UPDATED, STORAGE_KEY, STORAGE_VERSION


class RoutineStore:
    """Today's completed routine steps, per member and block."""

    def __init__(self, hass: HomeAssistant) -> None:
        """Set up the backing store."""
        self._hass = hass
        self._store: Store[dict[str, Any]] = Store(hass, STORAGE_VERSION, STORAGE_KEY)
        self._day: str = ""
        # member id -> block -> set of completed step labels
        self._done: dict[str, dict[str, set[str]]] = {}

    @staticmethod
    def _today() -> str:
        return date.today().isoformat()

    async def async_load(self) -> None:
        """Load persisted state, discarding anything from a previous day."""
        data = await self._store.async_load() or {}
        if data.get("day") != self._today():
            self._day = ""
            self._done = {}
            return
        self._day = data["day"]
        self._done = {
            member_id: {block: set(steps) for block, steps in blocks.items()}
            for member_id, blocks in (data.get("done") or {}).items()
        }

    async def _async_save(self) -> None:
        await self._store.async_save(
            {
                "day": self._day,
                "done": {
                    member_id: {block: sorted(steps) for block, steps in blocks.items()}
                    for member_id, blocks in self._done.items()
                },
            }
        )

    def _roll_day(self) -> bool:
        """Drop yesterday's ticks. Returns True when something was cleared."""
        today = self._today()
        if self._day == today:
            return False
        self._day = today
        had_state = bool(self._done)
        self._done = {}
        return had_state

    def completed(self, member_id: str, block: str) -> set[str]:
        """Steps this member has ticked off in this block today."""
        if self._day != self._today():
            # A read after midnight: yesterday's ticks no longer count.
            return set()
        return (self._done.get(member_id) or {}).get(block, set())

    def is_done(self, member_id: str, block: str, step: str) -> bool:
        """Whether a single step is ticked off today."""
        return step in self.completed(member_id, block)

    async def async_set(
        self, member_id: str, block: str, step: str, done: bool
    ) -> None:
        """Tick a step off, or put it back."""
        self._roll_day()
        blocks = self._done.setdefault(member_id, {})
        steps = blocks.setdefault(block, set())
        if done:
            steps.add(step)
        else:
            steps.discard(step)
        await self._async_save()
        async_dispatcher_send(self._hass, SIGNAL_ROUTINE_UPDATED)

    async def async_reset(self, member_id: str | None = None) -> None:
        """Clear today's ticks, for one member or for everyone."""
        self._roll_day()
        if member_id is None:
            self._done = {}
        else:
            self._done.pop(member_id, None)
        await self._async_save()
        async_dispatcher_send(self._hass, SIGNAL_ROUTINE_UPDATED)

    async def async_handle_midnight(self) -> None:
        """Roll the day over so the board clears itself without interaction."""
        if self._roll_day():
            await self._async_save()
        async_dispatcher_send(self._hass, SIGNAL_ROUTINE_UPDATED)
