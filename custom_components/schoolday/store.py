"""Which routine steps are ticked off today.

Kept out of the config entry on purpose: this changes many times a day, and
writing it there would rewrite the household's configuration every time a child
taps a step.

The reset is implicit. Nothing has to run at midnight for correctness — the
stored date is compared against today on every read, and a stale day reads as
"nothing done yet". The midnight listener in __init__.py exists only so the wall
panel visibly clears without anyone touching it.
"""

from __future__ import annotations

from datetime import date, timedelta
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers.dispatcher import async_dispatcher_send
from homeassistant.helpers.storage import Store

from .const import (
    SIGNAL_ABSENCE_UPDATED,
    SIGNAL_ROUTINE_UPDATED,
    STORAGE_KEY,
    STORAGE_KEY_ABSENCE,
    STORAGE_VERSION,
)


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


class AbsenceStore:
    """Who is at home ill, and until when.

    Stored as a last day rather than a flag, and that is the whole design. A flag has
    to be switched off by somebody remembering to; a date runs out on its own. The one
    thing worse than a board that does not know a child is ill is a board that still
    thinks so on Thursday because Monday was never undone.

    The default is today, because the person reaching for this is a parent at
    breakfast. Two days of flu is one more tap, and that tap is cheaper than the week
    of silent wrong announcements the other default would eventually cost.
    """

    def __init__(self, hass: HomeAssistant) -> None:
        """Set up the backing store."""
        self._hass = hass
        self._store: Store[dict[str, Any]] = Store(
            hass, STORAGE_VERSION, STORAGE_KEY_ABSENCE
        )
        # member id -> last day of the absence, inclusive
        self._until: dict[str, date] = {}

    @staticmethod
    def _today() -> date:
        return date.today()

    async def async_load(self) -> None:
        """Load persisted absences, dropping any that have run out."""
        data = await self._store.async_load() or {}
        loaded: dict[str, date] = {}
        for member_id, raw in (data.get("until") or {}).items():
            try:
                until = date.fromisoformat(str(raw))
            except ValueError:
                continue
            if until >= self._today():
                loaded[str(member_id)] = until
        self._until = loaded

    async def _async_save(self) -> None:
        await self._store.async_save(
            {
                "until": {
                    member_id: until.isoformat()
                    for member_id, until in self._until.items()
                }
            }
        )

    def _expire(self) -> bool:
        """Drop absences that have run out. Returns True when something was dropped."""
        today = self._today()
        expired = [
            member_id for member_id, until in self._until.items() if until < today
        ]
        for member_id in expired:
            del self._until[member_id]
        return bool(expired)

    def until(self, member_id: str) -> date | None:
        """The last day of this member's absence, or None when they are not ill.

        Expiry is checked on read as well as at midnight, so this is right even if
        nothing ran overnight.
        """
        until = self._until.get(member_id)
        return until if until is not None and until >= self._today() else None

    def is_absent(self, member_id: str) -> bool:
        """Whether this member is at home ill today."""
        return self.until(member_id) is not None

    async def async_set(
        self, member_id: str, absent: bool, until: date | None = None
    ) -> None:
        """Mark a member ill through a day, or say they are better."""
        self._expire()
        if absent:
            last = until or self._today()
            # Yesterday would store an absence that is already over, which reads as a
            # switch that refuses to turn on. Today is the shortest thing it can mean.
            self._until[member_id] = max(last, self._today())
        else:
            self._until.pop(member_id, None)
        await self._async_save()
        async_dispatcher_send(self._hass, SIGNAL_ABSENCE_UPDATED)

    async def async_handle_midnight(self) -> None:
        """Let absences run out, so the board recovers on its own."""
        if self._expire():
            await self._async_save()
        async_dispatcher_send(self._hass, SIGNAL_ABSENCE_UPDATED)

    @staticmethod
    def days_from_now(days: int) -> date:
        """The last day of an absence that lasts this many days, today included."""
        return date.today() + timedelta(days=max(1, days) - 1)
