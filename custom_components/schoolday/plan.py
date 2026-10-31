"""What changed about a school day, and how to say it.

The sensor knows a day's lessons before and after a calendar was read again; this works
out what that means to a parent — a lesson gone, another one in its place, a later
start — and writes the sentence a phone can show as it stands. Kept apart from the
sensor so it can be tested without Home Assistant, which is where the wording would
otherwise go wrong unnoticed.
"""

from __future__ import annotations

from dataclasses import dataclass
from datetime import date

from .models import Lesson, Period


@dataclass(slots=True, frozen=True)
class Changed:
    """A period whose lesson is not the one it was: a substitute, a room, an extra."""

    lesson: Lesson
    #: What the period held before, or None where it held nothing.
    instead: Lesson | None
    #: An empty period getting back the lesson the timetable has there: a cancellation
    #: taken back, which is not the same news as an extra lesson.
    restored: bool = False


@dataclass(slots=True)
class DayChange:
    """Everything that changed about one day, between two readings."""

    cancelled: list[Lesson]
    changed: list[Changed]
    #: The first and last period with a lesson in it, before and after.
    before: tuple[Period, Period] | None
    after: tuple[Period, Period] | None


def day_span(lessons: list[Lesson], periods: list[Period]) -> tuple[Period, Period] | None:
    """The first and the last period a day's lessons are in, or None for no lessons."""
    by_index = {period.index: period for period in periods}
    held = sorted(
        (by_index[lesson.period] for lesson in lessons if lesson.period in by_index),
        key=lambda period: period.start_minutes,
    )
    return (held[0], held[-1]) if held else None


def day_change(
    before: list[Lesson],
    after: list[Lesson],
    periods: list[Period],
    planned: list[Lesson] | None = None,
) -> DayChange | None:
    """What is different about a day, or None when nothing a parent would notice is.

    Compared period by period rather than as two lists, because that is how a school
    changes a day: the third period is cancelled, or the third period is Deutsch now.
    The spelling of a subject is compared without case, as everywhere else. `planned`
    is the day as the timetable has it, which tells a cancellation taken back from an
    extra lesson.
    """
    old = {lesson.period: lesson for lesson in before}
    new = {lesson.period: lesson for lesson in after}
    usual = {lesson.period: lesson for lesson in planned or []}
    cancelled = [old[period] for period in sorted(old) if period not in new]
    changed = [
        Changed(
            lesson=new[period],
            instead=old.get(period),
            restored=period not in old
            and period in usual
            and usual[period].subject.casefold() == new[period].subject.casefold(),
        )
        for period in sorted(new)
        if period not in old
        or new[period].subject.casefold() != old[period].subject.casefold()
        or (new[period].room or None) != (old[period].room or None)
    ]
    if not cancelled and not changed:
        return None
    return DayChange(
        cancelled=cancelled,
        changed=changed,
        before=day_span(before, periods),
        after=day_span(after, periods),
    )


class ChangeWatch:
    """Decides when two readings of the school system's calendar are a change worth saying.

    A reading is believed only once the next one says the same. A calendar that is being
    reloaded is briefly there and empty — WebUntis after a change to its options, every
    integration while Home Assistant starts — and comparing against that moment would
    announce every cancellation the school already had, as new, the next time it is
    read. Asking twice costs a minute; the sensor reads again that soon when a reading
    disagrees with what it believes.

    Days are compared where both readings have them, so the window moving on at
    midnight, or a day turning into a holiday, is not a difference.
    """

    def __init__(self) -> None:
        self._believed: dict[date, list[Lesson]] | None = None
        self._pending: dict[date, list[Lesson]] | None = None

    @staticmethod
    def _same(first: dict[date, list[Lesson]], second: dict[date, list[Lesson]]) -> bool:
        return all(first[day] == second[day] for day in first.keys() & second.keys())

    def observe(
        self, reading: dict[date, list[Lesson]]
    ) -> tuple[str, dict[date, list[Lesson]] | None]:
        """Take one reading; say what to do about it.

        `("change", before)` when this reading confirms a change — `before` is what was
        believed until now. `("recheck", None)` when it disagrees and wants a second
        look. `("quiet", None)` otherwise, including the very first reading, which is
        only the baseline.
        """
        if self._believed is None:
            self._believed = reading
            return "quiet", None
        if self._same(reading, self._believed):
            self._believed = reading
            self._pending = None
            return "quiet", None
        if self._pending is not None and self._same(reading, self._pending):
            before = self._believed
            self._believed = reading
            self._pending = None
            return "change", before
        self._pending = reading
        return "recheck", None


# --- the sentence --------------------------------------------------------------

# Only the languages the integration ships strings for. Anything else gets English,
# which is the language of the attribute names the sentence sits next to.
_WORDS: dict[str, dict[str, str]] = {
    "de": {
        "today": "heute",
        "tomorrow": "morgen",
        "period": "{n}. Std.",
        "periods": "{a}.–{b}. Std.",
        "cancelled": "{subject} ({when}) fällt aus.",
        "instead": "{subject} statt {old} ({when}).",
        "room": "{subject} in Raum {room} ({when}).",
        "extra": "Zusätzlich {subject} ({when}).",
        "restored": "{subject} ({when}) findet doch statt.",
        "with_room": "{when}, Raum {room}",
        "none": "Kein Unterricht.",
        "starts": "Beginn {new} statt {old}.",
        "ends": "Schluss {new} statt {old}.",
        "lead": "{name} {day}:",
    },
    # Hebrew verbs agree with the subject's gender, which a subject name does not carry,
    # so the changes lead with a noun ("ביטול: …") rather than guess "בוטל" or "בוטלה".
    "he": {
        "today": "היום",
        "tomorrow": "מחר",
        "period": "שיעור {n}",
        "periods": "שיעורים {a}–{b}",
        "cancelled": "ביטול: {subject} ({when}).",
        "instead": "{subject} במקום {old} ({when}).",
        "room": "{subject} בחדר {room} ({when}).",
        "extra": "תוספת: {subject} ({when}).",
        "restored": "חזר למערכת: {subject} ({when}).",
        "with_room": "{when}, חדר {room}",
        "none": "אין לימודים.",
        "starts": "התחלה ב-{new} במקום {old}.",
        "ends": "סיום ב-{new} במקום {old}.",
        "lead": "{name} {day}:",
    },
    "en": {
        "today": "today",
        "tomorrow": "tomorrow",
        "period": "period {n}",
        "periods": "periods {a}–{b}",
        "cancelled": "{subject} ({when}) is cancelled.",
        "instead": "{subject} instead of {old} ({when}).",
        "room": "{subject} in room {room} ({when}).",
        "extra": "Extra: {subject} ({when}).",
        "restored": "{subject} ({when}) is on after all.",
        "with_room": "{when}, room {room}",
        "none": "No lessons.",
        "starts": "Starts {new} instead of {old}.",
        "ends": "Finishes {new} instead of {old}.",
        "lead": "{name} {day}:",
    },
}

_WEEKDAYS: dict[str, list[str]] = {
    "de": ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"],
    "he": ["יום שני", "יום שלישי", "יום רביעי", "יום חמישי", "יום שישי", "שבת", "יום ראשון"],
    "en": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
}
# Spelled out rather than taken from strftime, which answers in the server's locale.
_MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
]


def _language(language: str | None) -> str:
    code = (language or "").split("-")[0].casefold()
    return code if code in _WORDS else "en"


def day_word(language: str | None, day: date, today: date) -> str:
    """"heute", "morgen", or the weekday and date for anything further off."""
    lang = _language(language)
    words = _WORDS[lang]
    ahead = (day - today).days
    if ahead == 0:
        return words["today"]
    if ahead == 1:
        return words["tomorrow"]
    weekday = _WEEKDAYS[lang][day.weekday()]
    if lang == "de":
        return f"{weekday}, {day.day}.{day.month}."
    if lang == "he":
        # Day before month, as on an Israeli school notice; no trailing dot, which in a
        # right-to-left sentence would land on the wrong side of the number.
        return f"{weekday} {day.day}.{day.month}"
    return f"{weekday} {day.day} {_MONTHS[day.month - 1]}"


def _runs(lessons: list[Lesson]) -> list[tuple[Lesson, int, int]]:
    """Consecutive periods of the same subject, as one: a double lesson is one lesson."""
    runs: list[tuple[Lesson, int, int]] = []
    for lesson in sorted(lessons, key=lambda item: item.period):
        if runs:
            first, start, end = runs[-1]
            if (
                lesson.period == end + 1
                and lesson.subject.casefold() == first.subject.casefold()
            ):
                runs[-1] = (first, start, lesson.period)
                continue
        runs.append((lesson, lesson.period, lesson.period))
    return runs


def _when(words: dict[str, str], start: int, end: int) -> str:
    if start == end:
        return words["period"].format(n=start)
    return words["periods"].format(a=start, b=end)


def message(
    language: str | None, name: str, day: date, today: date, change: DayChange
) -> str:
    """The change as one short paragraph, in the household's language.

    "Ben morgen: Musik (1. Std.) fällt aus. Beginn 08:45 statt 08:00." — the lessons
    first, because that is what changed, and the times after, because that is what a
    parent does something about.
    """
    words = _WORDS[_language(language)]
    parts = [words["lead"].format(name=name, day=day_word(language, day, today))]

    if change.after is None:
        parts.append(words["none"])
    else:
        for lesson, start, end in _runs(change.cancelled):
            parts.append(
                words["cancelled"].format(subject=lesson.subject, when=_when(words, start, end))
            )
    for item in change.changed:
        lesson = item.lesson
        when = _when(words, lesson.period, lesson.period)
        if lesson.room and (
            item.instead is None
            or item.instead.subject.casefold() != lesson.subject.casefold()
        ):
            when = words["with_room"].format(when=when, room=lesson.room)
        if item.restored:
            when = _when(words, lesson.period, lesson.period)
            parts.append(words["restored"].format(subject=lesson.subject, when=when))
        elif item.instead is None:
            parts.append(words["extra"].format(subject=lesson.subject, when=when))
        elif item.instead.subject.casefold() != lesson.subject.casefold():
            parts.append(
                words["instead"].format(
                    subject=lesson.subject, old=item.instead.subject, when=when
                )
            )
        elif lesson.room:
            parts.append(words["room"].format(subject=lesson.subject, room=lesson.room, when=when))

    if change.before is not None and change.after is not None:
        if change.before[0].start != change.after[0].start:
            parts.append(
                words["starts"].format(new=change.after[0].start, old=change.before[0].start)
            )
        if change.before[1].end != change.after[1].end:
            parts.append(words["ends"].format(new=change.after[1].end, old=change.before[1].end))
    return " ".join(parts)
