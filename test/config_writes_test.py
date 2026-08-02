"""Exercise the real config_writes module against the real models."""
import sys, types, itertools, pathlib

# config_writes needs exactly one thing from Home Assistant.
counter = itertools.count(1)
ulid = types.ModuleType("homeassistant.util.ulid")
ulid.ulid_now = lambda: f"ID{next(counter):03d}"
util = types.ModuleType("homeassistant.util")
util.ulid = ulid
ha = types.ModuleType("homeassistant")
ha.util = util
sys.modules.update({"homeassistant": ha, "homeassistant.util": util, "homeassistant.util.ulid": ulid})

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

# --- the base must never be mutated ---------------------------------------
check("Ausgangs-Optionen bleiben unveraendert",
      BASE["timetable"]["lessons"][MEMBER]["0"] == {"1": {"subject": "Deutsch", "room": None}}
      and BASE["members"][0]["name"] == "Ben" and BASE["routines"] == {},
      str(BASE["members"][0]))

print(f"\n{'alle bestanden' if not fails else str(fails) + ' fehlgeschlagen'}")
sys.exit(1 if fails else 0)
