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

from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.dispatcher import async_dispatcher_send
from homeassistant.helpers.storage import Store

from .models import today as _today

from .const import (
    ATTR_ASKED,
    ATTR_BEST_STREAK,
    ATTR_BLOCK,
    ATTR_BLOCKS,
    ATTR_DATE,
    ATTR_DAYS,
    ATTR_DONE,
    ATTR_MODE,
    ATTR_RATE,
    ATTR_STEP,
    ATTR_STEPS,
    ATTR_STREAK,
    HISTORY_DAYS,
    MODE_SCHOOL,
    ROUTINE_BLOCKS,
    SIGNAL_ABSENCE_UPDATED,
    SIGNAL_HOMEWORK_UPDATED,
    SIGNAL_ROUTINE_UPDATED,
    STORAGE_KEY,
    STORAGE_KEY_ABSENCE,
    STORAGE_KEY_HISTORY,
    STORAGE_KEY_HOMEWORK,
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
        return _today().isoformat()

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


class HistoryStore:
    """What each day asked of each child, and how much of it they did.

    The ticks in `RoutineStore` are wiped every midnight, and rightly so — a wall panel
    still showing yesterday's is a wall panel nobody believes. But wiping them also
    throws away the only answer to the question a parent actually has: is the evening
    routine working, or is it the same three steps that never happen?

    So the day is written down as it goes. Deliberately as the *record* and not as a
    score: what the board asked for, what got ticked, and what kind of day it was —
    because a holiday that asked for nothing is not a day anybody failed, and it must
    not read as one.

    Written by the member sensors, which are the only thing that knows both halves: the
    store knows what was ticked, and only the sensor knows what was on the list, since
    the evening list is partly generated from tomorrow's lessons.
    """

    #: How long the record reaches back. Everything older is swept.
    KEEP_DAYS = HISTORY_DAYS

    #: Ticks arrive in bursts — a child stands at the panel and taps four things. The
    #: live store saves each one at once because the board depends on it; this one is
    #: only ever read afterwards, so it coalesces the burst into a single write. Home
    #: Assistant flushes a delayed save on shutdown, so nothing is lost by waiting.
    SAVE_DELAY = 30

    def __init__(self, hass: HomeAssistant) -> None:
        """Set up the backing store."""
        self._hass = hass
        self._store: Store[dict[str, Any]] = Store(
            hass, STORAGE_VERSION, STORAGE_KEY_HISTORY
        )
        # day -> member id -> {"mode": str, "blocks": {block: {"asked": [], "done": []}}}
        self._days: dict[str, dict[str, dict[str, Any]]] = {}

    @staticmethod
    def _today() -> str:
        return _today().isoformat()

    async def async_load(self) -> None:
        """Load the record, dropping anything older than the window."""
        data = await self._store.async_load() or {}
        self._days = {
            str(day): {
                str(member_id): self._clean(record)
                for member_id, record in (members or {}).items()
                if isinstance(record, dict)
            }
            for day, members in (data.get(ATTR_DAYS) or {}).items()
        }
        if self._sweep():
            await self._store.async_save(self._data_to_save())

    @staticmethod
    def _clean(record: dict[str, Any]) -> dict[str, Any]:
        """One stored day for one member, with anything unreadable dropped."""
        blocks: dict[str, dict[str, list[str]]] = {}
        for block, entry in (record.get(ATTR_BLOCKS) or {}).items():
            if not isinstance(entry, dict):
                continue
            asked = [str(step) for step in (entry.get(ATTR_ASKED) or [])]
            done = {str(step) for step in (entry.get(ATTR_DONE) or [])}
            blocks[str(block)] = {
                ATTR_ASKED: asked,
                # Intersected rather than trusted: a step deleted from the routine after
                # it was ticked would otherwise count as done out of a total it is no
                # longer part of, and a child would be shown doing 4 of 3 things.
                ATTR_DONE: [step for step in asked if step in done],
            }
        return {ATTR_MODE: str(record.get(ATTR_MODE) or MODE_SCHOOL), ATTR_BLOCKS: blocks}

    def _data_to_save(self) -> dict[str, Any]:
        return {ATTR_DAYS: self._days}

    def _sweep(self) -> bool:
        """Drop days that have fallen out of the window."""
        cutoff = (_today() - timedelta(days=self.KEEP_DAYS - 1)).isoformat()
        stale = [day for day in self._days if day < cutoff]
        for day in stale:
            del self._days[day]
        return bool(stale)

    @callback
    def record(
        self,
        member_id: str,
        mode: str,
        block: str,
        asked: list[str],
        done: list[str],
    ) -> None:
        """Write down what this block asked of this member today, and what is ticked.

        Called on every publish rather than once at the end of the day, and that is the
        point: at midnight the ticks are already gone, so there is no end of the day
        left to read. Writing it as it happens also means a day is on the record even
        when nothing was ticked at all, which is exactly the day worth knowing about.
        """
        ticked = set(done)
        entry = {
            ATTR_ASKED: list(asked),
            ATTR_DONE: [step for step in asked if step in ticked],
        }
        record = self._days.setdefault(self._today(), {}).setdefault(
            member_id, {ATTR_MODE: mode, ATTR_BLOCKS: {}}
        )
        if record[ATTR_MODE] == mode and record[ATTR_BLOCKS].get(block) == entry:
            return
        record[ATTR_MODE] = mode
        record[ATTR_BLOCKS][block] = entry
        self._store.async_delay_save(self._data_to_save, self.SAVE_DELAY)

    def stats(self, member_id: str) -> dict[str, Any]:
        """One member's record, in the shape the statistics card and templates read.

        Today is in `days` so the card can draw the day in progress, but it is left out
        of every figure below it. An evening routine is 0 of 3 all morning, and a rate
        that dips at breakfast and recovers at bedtime is not measuring the child — it
        is measuring the clock.
        """
        today = self._today()
        days: list[dict[str, Any]] = []
        blocks = {block: [0, 0] for block in ROUTINE_BLOCKS}
        tallies: dict[tuple[str, str], list[int]] = {}
        #: One entry per counted day, oldest first: was everything asked for done?
        outcomes: list[bool] = []

        for day in sorted(self._days):
            record = self._days[day].get(member_id)
            if record is None:
                continue
            counting = day != today
            asked = done = 0
            for block, entry in record[ATTR_BLOCKS].items():
                asked += len(entry[ATTR_ASKED])
                done += len(entry[ATTR_DONE])
                if not counting:
                    continue
                if block in blocks:
                    blocks[block][0] += len(entry[ATTR_ASKED])
                    blocks[block][1] += len(entry[ATTR_DONE])
                ticked = set(entry[ATTR_DONE])
                for step in entry[ATTR_ASKED]:
                    tally = tallies.setdefault((block, step), [0, 0])
                    tally[0] += 1
                    tally[1] += step in ticked
            days.append(
                {
                    ATTR_DATE: day,
                    ATTR_MODE: record[ATTR_MODE],
                    ATTR_ASKED: asked,
                    ATTR_DONE: done,
                }
            )
            # A day that asked for nothing — a holiday with no list, a day at home ill —
            # is not a day anybody failed, so it neither counts against the rate nor
            # breaks a streak. Today counts only once it is finished, so a streak grows
            # at bedtime instead of collapsing at breakfast.
            if asked and (counting or done == asked):
                outcomes.append(done == asked)

        asked_total = sum(entry[0] for entry in blocks.values())
        done_total = sum(entry[1] for entry in blocks.values())
        return {
            ATTR_DATE: today,
            ATTR_RATE: _percent(done_total, asked_total),
            ATTR_STREAK: _trailing_run(outcomes),
            ATTR_BEST_STREAK: _longest_run(outcomes),
            ATTR_BLOCKS: {
                block: {
                    ATTR_ASKED: entry[0],
                    ATTR_DONE: entry[1],
                    ATTR_RATE: _percent(entry[1], entry[0]),
                }
                for block, entry in blocks.items()
            },
            # Worst first: the point of this list is which step keeps being skipped, and
            # that one should not be at the bottom of it.
            ATTR_STEPS: sorted(
                (
                    {
                        ATTR_BLOCK: block,
                        ATTR_STEP: step,
                        ATTR_ASKED: tally[0],
                        ATTR_DONE: tally[1],
                        ATTR_RATE: _percent(tally[1], tally[0]),
                    }
                    for (block, step), tally in tallies.items()
                ),
                key=lambda entry: (entry[ATTR_RATE], -entry[ATTR_ASKED], entry[ATTR_STEP]),
            ),
            ATTR_DAYS: days,
        }

    async def async_handle_midnight(self) -> None:
        """Let the window move on, so the record cannot grow without end."""
        if self._sweep():
            await self._store.async_save(self._data_to_save())


def _percent(done: int, asked: int) -> int | None:
    """A completion rate in whole percent, or None when nothing was ever asked.

    None rather than 0: a child who has never been asked to do anything has not failed
    to do it, and a card drawing that as an empty bar would be stating the opposite.
    """
    return round(100 * done / asked) if asked else None


def _trailing_run(outcomes: list[bool]) -> int:
    """How many days in a row, up to the last one counted, went completely."""
    run = 0
    for outcome in reversed(outcomes):
        if not outcome:
            break
        run += 1
    return run


def _longest_run(outcomes: list[bool]) -> int:
    """The best such run anywhere in the window."""
    best = run = 0
    for outcome in outcomes:
        run = run + 1 if outcome else 0
        best = max(best, run)
    return best


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
        return _today()

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
        return _today() + timedelta(days=max(1, days) - 1)


class HomeworkStore:
    """What each child still has to do, and what they have finished.

    Kept here rather than in the config entry for the same reason the routine ticks
    are: this changes several times an evening, and writing it into the household's
    configuration each time would be absurd.

    Finished homework is kept rather than deleted, and swept a fortnight later. The
    fortnight is not for the child — it is so that "did you do the maths?" on Thursday
    has an answer on Friday.
    """

    #: How long a finished item stays before it is swept.
    KEEP_DONE_DAYS = 14

    def __init__(self, hass: HomeAssistant) -> None:
        """Set up the backing store."""
        self._hass = hass
        self._store: Store[dict[str, Any]] = Store(
            hass, STORAGE_VERSION, STORAGE_KEY_HOMEWORK
        )
        # member id -> uid -> item
        self._items: dict[str, dict[str, dict[str, Any]]] = {}

    async def async_load(self) -> None:
        """Load the stored homework, sweeping anything long finished."""
        data = await self._store.async_load() or {}
        self._items = {
            str(member_id): {
                str(uid): dict(item)
                for uid, item in (items or {}).items()
                if isinstance(item, dict) and item.get("summary")
            }
            for member_id, items in (data.get("items") or {}).items()
        }
        if self._sweep():
            await self._async_save()

    async def _async_save(self) -> None:
        await self._store.async_save({"items": self._items})

    def _sweep(self) -> bool:
        """Drop items finished more than a fortnight ago."""
        cutoff = (_today() - timedelta(days=self.KEEP_DONE_DAYS)).isoformat()
        dropped = False
        for items in self._items.values():
            for uid in [
                uid
                for uid, item in items.items()
                if item.get("done_on") and str(item["done_on"]) < cutoff
            ]:
                del items[uid]
                dropped = True
        return dropped

    def items(self, member_id: str) -> list[tuple[str, dict[str, Any]]]:
        """One member's homework with its ids, unfinished first and then by due date.

        The id travels with the item because every caller needs it — ticking one off,
        deleting one, drawing one — and recovering it afterwards from the text would
        be guessing at the one thing that is not supposed to be guessed at.

        Undated work sorts last within its group: a thing with a deadline is the one
        that has to be looked at, and an empty date is not an early one.
        """
        entries = list((self._items.get(member_id) or {}).items())
        entries.sort(
            key=lambda entry: (
                bool(entry[1].get("done")),
                str(entry[1].get("due") or "9999-99-99"),
                str(entry[1].get("summary") or "").casefold(),
            )
        )
        return [(uid, dict(item)) for uid, item in entries]

    def open_count(self, member_id: str) -> int:
        """How much this member still has to do."""
        return sum(
            1 for item in (self._items.get(member_id) or {}).values() if not item.get("done")
        )

    async def async_add(
        self,
        member_id: str,
        uid: str,
        summary: str,
        due: str | None = None,
        description: str | None = None,
        done: bool = False,
    ) -> None:
        """Put a piece of homework on a member's list."""
        self._items.setdefault(member_id, {})[uid] = {
            "summary": summary,
            "due": due,
            "description": description,
            "done": done,
            "done_on": _today().isoformat() if done else None,
        }
        await self._async_save()
        async_dispatcher_send(self._hass, SIGNAL_HOMEWORK_UPDATED)

    async def async_update(
        self,
        member_id: str,
        uid: str,
        summary: str | None = None,
        due: str | None = None,
        description: str | None = None,
        done: bool | None = None,
        clear_due: bool = False,
    ) -> bool:
        """Change one item. Returns False when there is no such item."""
        item = (self._items.get(member_id) or {}).get(uid)
        if item is None:
            return False
        if summary is not None:
            item["summary"] = summary
        if clear_due:
            item["due"] = None
        elif due is not None:
            item["due"] = due
        if description is not None:
            item["description"] = description
        if done is not None and done != bool(item.get("done")):
            item["done"] = done
            # Stamped when it is ticked, because that is what the sweep counts from.
            item["done_on"] = _today().isoformat() if done else None
        await self._async_save()
        async_dispatcher_send(self._hass, SIGNAL_HOMEWORK_UPDATED)
        return True

    async def async_remove(self, member_id: str, uids: list[str]) -> None:
        """Take items off a member's list for good."""
        items = self._items.get(member_id) or {}
        for uid in uids:
            items.pop(uid, None)
        await self._async_save()
        async_dispatcher_send(self._hass, SIGNAL_HOMEWORK_UPDATED)

    async def async_handle_midnight(self) -> None:
        """Sweep what has been finished long enough, and let the cards redraw.

        The redraw matters even when nothing was swept: "due today" means something
        different after midnight, and nothing else would tell the board that.
        """
        if self._sweep():
            await self._async_save()
        async_dispatcher_send(self._hass, SIGNAL_HOMEWORK_UPDATED)
