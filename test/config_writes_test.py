"""Exercise the real config_writes module against the real models."""
import ast
import datetime
import itertools
import pathlib
import sys
import types

# config_writes needs exactly one thing from Home Assistant.
counter = itertools.count(1)
ulid = types.ModuleType("homeassistant.util.ulid")
ulid.ulid_now = lambda: f"ID{next(counter):03d}"
# models.today() asks Home Assistant for the date rather than the system clock, because
# the two can be in different timezones. Here it is simply the system clock.
dt = types.ModuleType("homeassistant.util.dt")
dt.now = datetime.datetime.now
util = types.ModuleType("homeassistant.util")
util.ulid = ulid
util.dt = dt
ha = types.ModuleType("homeassistant")
ha.util = util
sys.modules.update({
    "homeassistant": ha,
    "homeassistant.util": util,
    "homeassistant.util.ulid": ulid,
    "homeassistant.util.dt": dt,
})

# A stand-in package, so the relative imports resolve without running __init__.py
# (which pulls in half of Home Assistant's frontend).
pkg = types.ModuleType("schoolday")
pkg.__path__ = ["/home/user/HA-Schoolday/custom_components/schoolday"]
sys.modules["schoolday"] = pkg
import importlib  # noqa: E402
W = importlib.import_module("schoolday.config_writes")
SchooldayValueError = W.SchooldayValueError

MEMBER = "M1"
BASE = {
    "members": [{"id": MEMBER, "name": "Ben", "color": "#3a86c8", "order": 0}],
    "routines": {},
    "timetable": {
        "periods": ["08:00-08:45", "08:45-09:30", "09:50-10:35"],
        "colors": {},
        "lessons": {MEMBER: {"0": {"1": {"subject": "Deutsch", "room": None}}}},
    },
    "school_calendars": [],
    "care_keywords": [],
}

fails = 0
def check(name, ok, detail=""):
    global fails
    fails += not ok
    print(f"{'PASS' if ok else 'FAIL'}  {name}" + (f"  — {detail}" if detail else ""))

def merged(changes, base=None):
    return {**(base or BASE), **changes}

# --- periods ---------------------------------------------------------------
out = W.set_periods(BASE, ["08:00-08:45", "10:00-10:45"])
check("Stundenzeiten werden gesetzt",
      out["timetable"]["periods"] == ["08:00-08:45", "10:00-10:45"],
      str(out["timetable"]["periods"]))

try:
    W.set_periods(BASE, ["kaputt"])
    check("kaputte Stundenzeit wird abgewiesen", False, "keine Ausnahme")
except SchooldayValueError as e:
    check("kaputte Stundenzeit wird abgewiesen", "HH:MM" in str(e), str(e)[:60])

# --- one cell --------------------------------------------------------------
out = W.set_lesson(BASE, MEMBER, 0, 2, "Mathe", "R12")
day = out["timetable"]["lessons"][MEMBER]["0"]
check("Zelle wird gesetzt, Nachbar bleibt",
      day["1"]["subject"] == "Deutsch" and day["2"] == {"subject": "Mathe", "room": "R12"},
      str(day))

out = W.set_lesson(BASE, MEMBER, 0, 1, "")
check("leeres Fach räumt die Zelle",
      "0" not in out["timetable"]["lessons"].get(MEMBER, {}),
      str(out["timetable"]["lessons"]))

try:
    W.set_lesson(BASE, MEMBER, 0, 9, "Mathe")
    check("Stunde ausserhalb des Rasters abgewiesen", False, "keine Ausnahme")
except SchooldayValueError as e:
    check("Stunde ausserhalb des Rasters abgewiesen", "no period 9" in str(e), str(e)[:60])

try:
    W.set_lesson(BASE, MEMBER, 9, 1, "Mathe")
    check("unmoeglicher Wochentag abgewiesen", False, "keine Ausnahme")
except SchooldayValueError as e:
    check("unmoeglicher Wochentag abgewiesen", "weekday" in str(e), str(e)[:60])

# One spelling per subject, exactly as the options flow settles it.
out = W.set_lesson(BASE, MEMBER, 1, 1, "deutsch")
check("Schreibweise wird an die Woche angeglichen",
      out["timetable"]["lessons"][MEMBER]["1"]["1"]["subject"] == "Deutsch",
      out["timetable"]["lessons"][MEMBER]["1"]["1"]["subject"])

# --- a whole day -----------------------------------------------------------
out = W.set_day(BASE, MEMBER, 2, [{"period": 2, "subject": "Sport", "room": "Halle"},
                                  {"period": 1, "subject": "Kunst"},
                                  {"period": 3, "subject": ""}])
day = out["timetable"]["lessons"][MEMBER]["2"]
check("ganzer Tag, sortiert, leere Eintraege fallen raus",
      list(day) == ["1", "2"] and day["2"]["room"] == "Halle", str(day))

# --- colours ---------------------------------------------------------------
out = W.set_subject_color(BASE, "Deutsch", [255, 0, 0])
check("Farbe als RGB", out["timetable"]["colors"] == {"Deutsch": "#ff0000"},
      str(out["timetable"]["colors"]))
out = W.set_subject_color(merged(out), "Deutsch", None)
check("Farbe zuruecksetzen entfernt den Eintrag", out["timetable"]["colors"] == {},
      str(out["timetable"]["colors"]))

# --- routines --------------------------------------------------------------
out = W.set_routine(BASE, MEMBER, "morning", "0", ["Zähne putzen", "  "])
check("Routine setzt Schritte und wirft Leeres weg",
      out["routines"][MEMBER]["morning"]["0"] == ["Zähne putzen"],
      str(out["routines"]))
out = W.set_routine(merged(out), MEMBER, "morning", "0", [])
check("leere Liste loescht den Tag",
      "0" not in out["routines"][MEMBER]["morning"], str(out["routines"]))
try:
    W.set_routine(BASE, MEMBER, "nachts", "0", ["x"])
    check("unbekannter Block abgewiesen", False, "keine Ausnahme")
except SchooldayValueError as e:
    check("unbekannter Block abgewiesen", "routine block" in str(e), str(e)[:50])
out = W.set_routine(BASE, MEMBER, "morning", "care", ["Brotdose"])
check("Betreuungstag ist ein gueltiger Routine-Tag",
      out["routines"][MEMBER]["morning"]["care"] == ["Brotdose"], str(out["routines"]))

# --- members ---------------------------------------------------------------
changes, new_id = W.set_member(BASE, None, "Nik", "#4f9d69")
check("neues Mitglied bekommt Id und Platz",
      len(changes["members"]) == 2 and changes["members"][1]["order"] == 1
      and changes["members"][1]["id"] == new_id, str(changes["members"][1]))

changes, _ = W.set_member(BASE, MEMBER, "Benjamin", "#3a86c8")
check("bestehendes Mitglied wird umbenannt, Id bleibt",
      changes["members"][0]["name"] == "Benjamin" and changes["members"][0]["id"] == MEMBER,
      str(changes["members"][0]))

try:
    W.set_member(BASE, "gibtsnicht", "X")
    check("unbekannte Id abgewiesen", False, "keine Ausnahme")
except SchooldayValueError as e:
    check("unbekannte Id abgewiesen", "gibtsnicht" in str(e), str(e)[:50])

try:
    W.set_member(BASE, None, "   ")
    check("namenloses Mitglied abgewiesen", False, "keine Ausnahme")
except SchooldayValueError as e:
    check("namenloses Mitglied abgewiesen", "needs a name" in str(e), str(e)[:50])

# Removing takes the member's week and routines with it.
withroutine = merged(W.set_routine(BASE, MEMBER, "morning", "0", ["Zähne putzen"]))
out = W.remove_member(withroutine, MEMBER)
check("Entfernen raeumt Woche und Routinen mit weg",
      out["members"] == [] and out["routines"] == {}
      and out["timetable"]["lessons"] == {}, str(out["routines"]))

# --- calendars -------------------------------------------------------------
out = W.set_calendars(BASE, ["calendar.ferien"], ["Ferienbetreuung", " "])
check("Kalender und Stichwoerter",
      out["school_calendars"] == ["calendar.ferien"]
      and out["care_keywords"] == ["Ferienbetreuung"], str(out))
try:
    W.set_calendars(BASE, ["sensor.falsch"], None)
    check("Nicht-Kalender abgewiesen", False, "keine Ausnahme")
except SchooldayValueError as e:
    check("Nicht-Kalender abgewiesen", "not a calendar" in str(e), str(e)[:50])
out = W.set_calendars(BASE, None, ["Hort"])
check("nur Stichwoerter laesst Kalender unberuehrt",
      "school_calendars" not in out and out["care_keywords"] == ["Hort"], str(out))

# --- materials -------------------------------------------------------------
out = W.set_materials(BASE, "Sport", ["Sportbeutel", " ", "Turnschuhe"])
check("Material wird gesetzt, Leerzeilen fallen weg",
      out["materials"] == {"Sport": ["Sportbeutel", "Turnschuhe"]}, str(out))

# The same subject typed with different capitals must edit one entry, not make a
# second one the packing list would then read out twice.
out = W.set_materials(merged(out), "sport", ["Badesachen"])
check("Fach unterschiedlich geschrieben ergibt einen Eintrag",
      out["materials"] == {"sport": ["Badesachen"]}, str(out))

out = W.set_materials(merged({"materials": {"Sport": ["Sportbeutel"]}}), "Sport", [])
check("leere Liste entfernt das Fach", out["materials"] == {}, str(out))

try:
    W.set_materials(BASE, "  ", ["x"])
    check("Fach ohne Namen abgewiesen", False, "keine Ausnahme")
except SchooldayValueError as e:
    check("Fach ohne Namen abgewiesen", "needs a name" in str(e), str(e)[:50])

# --- the packing list a day generates --------------------------------------
Models = importlib.import_module("schoolday.models")
config = Models.SchooldayConfig.from_options(
    merged({"materials": {"Sport": ["Sportbeutel", "Turnschuhe"], "Schwimmen": ["Handtuch", "Sportbeutel"]}})
)
check("Packliste kommt in Fach-Reihenfolge",
      config.packing_list(["Sport"]) == [("Sportbeutel", "Sport"), ("Turnschuhe", "Sport")],
      str(config.packing_list(["Sport"])))
# One towel, not two: a child ticking the same thing off twice stops trusting the list.
check("eine Sache aus zwei Faechern steht einmal da",
      [item for item, _ in config.packing_list(["Sport", "Schwimmen"])]
      == ["Sportbeutel", "Turnschuhe", "Handtuch"],
      str(config.packing_list(["Sport", "Schwimmen"])))
check("Fach ohne Material ergibt nichts", config.packing_list(["Mathe"]) == [], "")
# The tag keeps the spelling from the timetable, not the one from the materials, so
# only the things themselves are compared here.
check("Gross- und Kleinschreibung egal",
      [item for item, _ in config.packing_list(["sport"])]
      == [item for item, _ in config.packing_list(["Sport"])],
      str(config.packing_list(["sport"])))

# A sick day has no routine at all — deliberately not the holiday list, which would
# offer swimming things to a child in bed.
routine = Models.Routine.from_dict({"0": ["Zaehne putzen"], "free": ["Ausschlafen"]})
check("kranker Tag hat keine Schritte",
      routine.steps_for(0, "sick") == []
      and routine.steps_for(0, "free") == ["Ausschlafen"],
      str(routine.steps_for(0, "sick")))

# --- dates come from Home Assistant, not from the container --------------------
# `date.today()` reads the system clock's zone. Home Assistant has its own, and where
# they differ everything dated rolls over at the wrong moment — silently, and only for
# the households whose container disagrees with them.
# Parsed rather than grepped: the one legitimate mention of `date.today()` is the
# comment in models.py explaining why not to call it, and a text search finds that too.
def calls_date_today(path):
    tree = ast.parse(pathlib.Path(path).read_text())
    return [
        node.lineno
        for node in ast.walk(tree)
        if isinstance(node, ast.Call)
        and isinstance(node.func, ast.Attribute)
        and node.func.attr == "today"
        and isinstance(node.func.value, ast.Name)
        and node.func.value.id == "date"
    ]

for name in ("config_writes.py", "models.py", "store.py", "sensor.py"):
    lines = calls_date_today(pathlib.Path("custom_components/schoolday") / name)
    check(
        f"{name} fragt nicht die Systemuhr nach dem Datum",
        not lines,
        f"date.today() in Zeile {lines}" if lines else "keine",
    )

# --- the two-week cycle ----------------------------------------------------

CT = datetime.date(2026, 9, 14)

out = W.set_cycle({}, 2, iso_week=37, iso_year=2026, today=CT)
check("KW wird als Montag gespeichert",
      out == {"cycle_weeks": 2, "cycle_anchor": "2026-09-07"}, str(out))
out = W.set_cycle({}, 2, anchor="2026-09-16", today=CT)
check("ein Datum wird auf seinen Montag zurueckgesetzt",
      out["cycle_anchor"] == "2026-09-14", str(out))
out = W.set_cycle({}, 2, today=CT)
check("Zyklus ohne Angabe faengt in dieser Woche an",
      out["cycle_anchor"] == "2026-09-14", str(out))
out = W.set_cycle({"cycle_anchor": "2026-09-07"}, 1, today=CT)
check("Zyklus aus laesst den Anker stehen",
      out == {"cycle_weeks": 1}, str(out))
try:
    W.set_cycle({}, 3, today=CT)
    check("mehr als zwei Wochen abgewiesen", False, "keine Ausnahme")
except SchooldayValueError as e:
    check("mehr als zwei Wochen abgewiesen", "1 or 2 weeks" in str(e), str(e)[:50])
try:
    # 2025 has 52 ISO weeks; 2026 has 53. Exactly why a week number alone is not
    # something to store.
    W.set_cycle({}, 2, iso_week=53, iso_year=2025, today=CT)
    check("KW 53 in einem 52-Wochen-Jahr abgewiesen", False, "keine Ausnahme")
except SchooldayValueError as e:
    check("KW 53 in einem 52-Wochen-Jahr abgewiesen", "no calendar week" in str(e), str(e)[:50])

CYCLED = merged({
    "cycle_weeks": 2, "cycle_anchor": "2026-09-07",
    "timetable": {"periods": ["08:00-08:45"],
                  "lessons": {MEMBER: {"0": {"1": {"subject": "Deutsch"}},
                                       "7": {"1": {"subject": "Mathe"}}}}},
})
cyc = Models.SchooldayConfig.from_options(CYCLED)
check("A- und B-Woche liefern verschiedene Stunden",
      [lesson.subject for lesson in cyc.lessons_on(MEMBER, datetime.date(2026, 9, 7))] == ["Deutsch"]
      and [lesson.subject for lesson in cyc.lessons_on(MEMBER, datetime.date(2026, 9, 14))] == ["Mathe"]
      and [lesson.subject for lesson in cyc.lessons_on(MEMBER, datetime.date(2026, 9, 21))] == ["Deutsch"],
      "Mo 7.9. / 14.9. / 21.9.")

# Turning the cycle off must not throw week B away — only stop showing it.
off = Models.SchooldayConfig.from_options({**CYCLED, "cycle_weeks": 1})
check("Zyklus aus zeigt wieder die A-Woche, B bleibt gespeichert",
      [lesson.subject for lesson in off.lessons_on(MEMBER, datetime.date(2026, 9, 14))] == ["Deutsch"]
      and off.timetable.uses_second_week,
      str(off.timetable.uses_second_week))

out = W.set_lesson(CYCLED, MEMBER, 1, 1, "Physik", week=1)
check("in die B-Woche schreiben landet im Slot 8",
      out["timetable"]["lessons"][MEMBER]["8"]["1"]["subject"] == "Physik",
      str(sorted(out["timetable"]["lessons"][MEMBER])))
try:
    W.set_lesson(CYCLED, MEMBER, 1, 1, "Physik", week=2)
    check("dritte Woche abgewiesen", False, "keine Ausnahme")
except SchooldayValueError as e:
    check("dritte Woche abgewiesen", "week of the cycle" in str(e), str(e)[:50])

# --- exceptions ------------------------------------------------------------
import datetime  # noqa: E402

TODAY = datetime.date(2026, 9, 14)
SOON = "2026-09-18"

out = W.set_exception(BASE, MEMBER, SOON, label="Wandertag", today=TODAY)
check("Tages-Ausnahme wird gesetzt",
      out["exceptions"][MEMBER][SOON]["label"] == "Wandertag", str(out["exceptions"]))

# A label is what says the day is taken over; there is no second flag to disagree with.
Models = importlib.import_module("schoolday.models")
day = Models.DayException.from_dict(out["exceptions"][MEMBER][SOON])
check("Bezeichnung nimmt den Tag ein", day.closed and day.applied_to([Models.Lesson(1, "Deutsch")]) == [], str(day))

out = W.set_exception(merged(out), MEMBER, SOON, label="", today=TODAY)
check("leere Bezeichnung gibt den Tag zurueck", out["exceptions"] == {}, str(out["exceptions"]))

# One period, three ways: cancelled, replaced, handed back.
out = W.set_exception(BASE, MEMBER, SOON, period=1, cancelled=True, today=TODAY)
entry = out["exceptions"][MEMBER][SOON]["periods"]["1"]
check("Stunde entfaellt", entry == {}, str(entry))

out = W.set_exception(merged(out), MEMBER, SOON, period=2, subject="Vertretung", room="R2", today=TODAY)
check("Stunde wird ersetzt",
      out["exceptions"][MEMBER][SOON]["periods"]["2"] == {"subject": "Vertretung", "room": "R2"},
      str(out["exceptions"][MEMBER][SOON]["periods"]))

out = W.set_exception(merged(out), MEMBER, SOON, period=1, today=TODAY)
check("weder entfallen noch ersetzt gibt die Stunde zurueck",
      "1" not in out["exceptions"][MEMBER][SOON]["periods"], str(out["exceptions"]))

# What the sensors ask: the week, with that one date's changes applied.
config = Models.SchooldayConfig.from_options(merged(out))
check("Datum ueberschreibt den Wochentag",
      [(lesson.period, lesson.subject) for lesson in config.lessons_on(MEMBER, datetime.date(2026, 9, 14))]
      == [(1, "Deutsch")],
      "Montag ohne Ausnahme")
# 18 September 2026 is a Friday, which the base week leaves empty — so the replacement
# is the only thing on, which is exactly what a substitution on a free period means.
check("Ersatzstunde erscheint am Datum",
      [(lesson.period, lesson.subject) for lesson in config.lessons_on(MEMBER, datetime.date(2026, 9, 18))]
      == [(2, "Vertretung")],
      str([(lesson.period, lesson.subject) for lesson in config.lessons_on(MEMBER, datetime.date(2026, 9, 18))]))

try:
    W.set_exception(BASE, MEMBER, "2026-09-01", label="zu spaet", today=TODAY)
    check("vergangenes Datum abgewiesen", False, "keine Ausnahme")
except SchooldayValueError as e:
    check("vergangenes Datum abgewiesen", "already been" in str(e), str(e)[:60])

try:
    W.set_exception(BASE, MEMBER, "kein Datum", label="x", today=TODAY)
    check("kaputtes Datum abgewiesen", False, "keine Ausnahme")
except SchooldayValueError as e:
    check("kaputtes Datum abgewiesen", "YYYY-MM-DD" in str(e), str(e)[:60])

try:
    W.set_exception(BASE, MEMBER, SOON, period=99, cancelled=True, today=TODAY)
    check("unbekannte Stunde abgewiesen", False, "keine Ausnahme")
except SchooldayValueError as e:
    check("unbekannte Stunde abgewiesen", "no period 99" in str(e), str(e)[:60])

# Everything before today goes on every write, so this can never become a second
# timetable nobody maintains.
stale = merged({"exceptions": {MEMBER: {"2020-01-01": {"label": "alt"}, SOON: {"label": "neu"}}}})
out = W.set_exception(stale, MEMBER, SOON, label="neu", today=TODAY)
check("vergangene Ausnahmen werden beim Schreiben verworfen",
      list(out["exceptions"][MEMBER]) == [SOON], str(out["exceptions"]))

# A subject that only ever covers one period on one date still needs a colour: a
# lesson with none is the one thing on the card that reads as broken.
covered = Models.SchooldayConfig.from_options(
    merged(W.set_exception(BASE, MEMBER, SOON, period=2, subject="Vertretung", today=TODAY))
)
check("Vertretungsfach bekommt eine Farbe",
      "Vertretung" in covered.timetable.as_card_dict(covered.exception_subjects)["subjects"],
      str(sorted(covered.timetable.as_card_dict(covered.exception_subjects)["subjects"])))

out = W.clear_exception(merged(out), MEMBER, SOON, today=TODAY)
check("zuruecksetzen raeumt das Datum weg", out["exceptions"] == {}, str(out["exceptions"]))

# --- the base must never be mutated ---------------------------------------
check("Ausgangs-Optionen bleiben unveraendert",
      BASE["timetable"]["lessons"][MEMBER]["0"] == {"1": {"subject": "Deutsch", "room": None}}
      and BASE["members"][0]["name"] == "Ben" and BASE["routines"] == {},
      str(BASE["members"][0]))

# --- every registered service handler must run on the event loop ------------
# A synchronous handler is run by Home Assistant in a worker thread, and touching
# async_update_entry from there is refused outright. This is a static check because
# the failure only ever showed up at the moment somebody pressed Save.

services_src = pathlib.Path(
    "/home/user/HA-Schoolday/custom_components/schoolday/services.py"
).read_text()
tree = ast.parse(services_src)

registered = set()
for node in ast.walk(tree):
    if (
        isinstance(node, ast.Call)
        and isinstance(node.func, ast.Attribute)
        and node.func.attr == "async_register"
    ):
        for arg in node.args[2:3]:
            if isinstance(arg, ast.Name):
                registered.add(arg.id)
# Handlers registered inside a `for service, handler, schema in (...)` loop are named
# by the loop variable, so resolve those to the real functions and drop the variable.
for node in ast.walk(tree):
    if isinstance(node, ast.For) and isinstance(node.target, ast.Tuple):
        registered -= {
            element.id for element in node.target.elts if isinstance(element, ast.Name)
        }
        for element in getattr(node.iter, "elts", []):
            if isinstance(element, ast.Tuple) and len(element.elts) >= 2:
                handler = element.elts[1]
                if isinstance(handler, ast.Name):
                    registered.add(handler.id)

coroutines = {
    node.name for node in ast.walk(tree) if isinstance(node, ast.AsyncFunctionDef)
}
guarded = {
    node.name
    for node in ast.walk(tree)
    if isinstance(node, ast.FunctionDef)
    and any(
        isinstance(d, ast.Name) and d.id == "_guard" for d in node.decorator_list
    )
}
check(
    "jeder registrierte Service laeuft auf dem Event-Loop",
    registered and registered <= (coroutines | guarded),
    f"{len(registered)} registriert, ungedeckt: {sorted(registered - coroutines - guarded)}",
)
check(
    "_guard liefert eine Coroutine, keine synchrone Funktion",
    "async def wrapped" in services_src,
    "async def wrapped" if "async def wrapped" in services_src else "def wrapped",
)

# --- the orphan sweep must know every unique id ----------------------------
# _async_remove_orphans deletes every registry entry of the config entry it does not
# recognise, across all platforms. A platform missing from its expected set has its
# entities deleted the moment they are created — and silently, which is the worst part.
made = set()
for path in pathlib.Path("custom_components/schoolday").glob("*.py"):
    for node in ast.walk(ast.parse(path.read_text())):
        if isinstance(node, ast.Assign) and any(
            isinstance(target, ast.Attribute) and target.attr == "_attr_unique_id"
            for target in node.targets
        ):
            made.add(ast.unparse(node.value).split("(")[0].split(".")[-1])
sensor_src = pathlib.Path("custom_components/schoolday/sensor.py").read_text()
check(
    "die Waise-Bereinigung kennt jede erzeugte unique_id",
    made and all(name in sensor_src for name in made),
    f"{len(made)} Quellen, unbekannt: {sorted(n for n in made if n not in sensor_src)}",
)

# --- the brand images must stay within the sizes home-assistant/brands allows ---
# Dimensions only, from the PNG header, so this needs nothing but the standard library.
# Trimming is the render script's job; getting the size wrong is the likely mistake,
# and a brands pull request is rejected for it without much explanation.
import struct  # noqa: E402

BRANDS = pathlib.Path("brands/custom_integrations/schoolday")


def png_size(path):
    with open(path, "rb") as fh:
        return struct.unpack(">II", fh.read(24)[16:24])


sizes = {name: png_size(BRANDS / name) for name in
         ("icon.png", "icon@2x.png", "logo.png", "logo@2x.png")}
check(
    "Icons sind quadratisch, 256 und 512",
    sizes["icon.png"] == (256, 256) and sizes["icon@2x.png"] == (512, 512),
    str({k: v for k, v in sizes.items() if k.startswith("icon")}),
)
check(
    "Logos: kuerzeste Seite 128..256 bzw. 256..512",
    128 <= min(sizes["logo.png"]) <= 256 and 256 <= min(sizes["logo@2x.png"]) <= 512,
    f"{min(sizes['logo.png'])} / {min(sizes['logo@2x.png'])}",
)

print(f"\n{'alle bestanden' if not fails else str(fails) + ' fehlgeschlagen'}")
sys.exit(1 if fails else 0)
